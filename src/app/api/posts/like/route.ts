import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { postId, action = "increment" } = await request.json();
    const cookieStore = await cookies();
    
    // Check if requester is Admin for decrement permission
    const adminToken = cookieStore.get("admin_token")?.value;
    const isAdmin = adminToken === "valid-admin-token";

    // 1. If Decrementing, it MUST be an Admin
    if (action === "decrement" && !isAdmin) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
    }

    // 2. Perform the action (Allowed for everyone if incrementing)
    const incrementValue = action === "increment" ? 1 : -1;
    const { data, error } = await supabaseAdmin.rpc("increment_like_v2", { 
      p_post_id: postId, 
      p_amount: incrementValue 
    });
    
    if (error) throw error;
    
    // 3. Create Notification for Likes (Optimistic)
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
    
    return NextResponse.json({ success: true, isAdmin });

  } catch (error: any) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Always return not liked to allow repeated clicks in UI if desired
  return NextResponse.json({ liked: false });
}
