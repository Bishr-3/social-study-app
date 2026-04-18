import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash, randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

function getLikeClientId(requestCookies: Awaited<ReturnType<typeof cookies>>) {
  return requestCookies.get("like_user_id")?.value || randomUUID();
}

function getUserHash(clientId: string) {
  return createHash("sha256").update(clientId).digest("hex");
}

function attachLikeCookie(response: NextResponse, requestCookies: Awaited<ReturnType<typeof cookies>>, clientId: string) {
  if (!requestCookies.get("like_user_id")) {
    response.cookies.set("like_user_id", clientId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { postId, action = "increment" } = await request.json();
    const cookieStore = await cookies();
    const likeClientId = getLikeClientId(cookieStore);
    const user_hash = getUserHash(likeClientId);
    
    // Check if requester is Admin for decrement permission
    const adminToken = cookieStore.get("admin_token")?.value;
    const isAdmin = adminToken === "valid-admin-token";

    // 1. If Decrementing, it MUST be an Admin
    if (action === "decrement" && !isAdmin) {
      const response = NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
      attachLikeCookie(response, cookieStore, likeClientId);
      return response;
    }

    // 2. Prevent duplicate likes using the new like_post function
    if (action === "increment") {
      const { data: likeResult, error: likeError } = await supabaseAdmin.rpc("like_post", {
        p_post_id: postId,
        p_user_hash: user_hash
      });

      if (likeError) throw likeError;

      if (likeResult === "ALREADY_LIKED") {
        const response = NextResponse.json({ error: "ALREADY_LIKED" }, { status: 409 });
        attachLikeCookie(response, cookieStore, likeClientId);
        return response;
      }
    }
    
    // 4. Create Notification for Likes (Optimistic)
    if (action === "increment") {
      try {
        // Fetch post owner info
        const { data: postData } = await supabaseAdmin
          .from("posts")
          .select("student_name")
          .eq("id", postId)
          .single();

        if (postData) {
          await supabaseAdmin.from("notifications").insert({
            post_id: postId,
            type: 'like',
            message: `شخص ما أعجب بمشاركتك!`,
            student_name: postData.student_name,
            actor_name: 'مبدع آخر'
          });
        }
      } catch (e) {
        console.error("Notification Error:", e);
      }
    }
    
    const response = NextResponse.json({ success: true, isAdmin });
    attachLikeCookie(response, cookieStore, likeClientId);
    return response;

  } catch (error: any) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const likeClientId = getLikeClientId(cookieStore);
  const user_hash = getUserHash(likeClientId);

  const url = new URL(request.url);
  const postId = url.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { error: "MISSING_POST_ID" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("post_likes_audit")
    .select("id")
    .eq("post_id", postId)
    .eq("user_hash", user_hash)
    .maybeSingle();

  if (error) {
    console.error("Like status lookup failed:", error);
    const response = NextResponse.json({ liked: false });
    attachLikeCookie(response, cookieStore, likeClientId);
    return response;
  }

  const response = NextResponse.json({ liked: Boolean(data) });
  attachLikeCookie(response, cookieStore, likeClientId);
  return response;
}
