import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { postId, action = "increment" } = await request.json();
    const cookieStore = await cookies();
    const headerList = await headers();
    
    const adminToken = cookieStore.get("admin_token")?.value;
    const isAdmin = adminToken === "valid-admin-token";

    // 1. If Admin, bypass all protections
    if (isAdmin) {
      const incrementValue = action === "increment" ? 1 : -1;
      const { data, error } = await supabaseAdmin.rpc("increment_like_v2", { 
        p_post_id: postId, 
        p_amount: incrementValue 
      });
      
      if (error) throw error;
      return NextResponse.json({ success: true, isAdmin: true });
    }

    // 2. Non-Admin (Student or Teacher): Strong protection
    const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
    const userHash = crypto.createHash("sha256").update(ip + postId).digest("hex");

    // Check if already liked in audit table
    const { data: existingLike } = await supabaseAdmin
      .from("post_likes_audit")
      .select("id")
      .eq("post_id", postId)
      .eq("user_hash", userHash)
      .single();

    if (existingLike) {
      return NextResponse.json({ error: "ALREADY_LIKED" }, { status: 403 });
    }

    // Insert into audit table and increment likes
    const { error: auditError } = await supabaseAdmin
      .from("post_likes_audit")
      .insert({ post_id: postId, user_hash: userHash });

    if (auditError) {
      if (auditError.code === "23505") { // Unique violation
        return NextResponse.json({ error: "ALREADY_LIKED" }, { status: 403 });
      }
      throw auditError;
    }

    await supabaseAdmin.rpc("increment_like_v2", { 
      p_post_id: postId, 
      p_amount: 1 
    });

    return NextResponse.json({ success: true, isAdmin: false });

  } catch (error: any) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Logic to check if a user has liked a post (optional for UI)
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
  const userHash = crypto.createHash("sha256").update(ip + postId).digest("hex");

  const { data } = await supabaseAdmin
    .from("post_likes_audit")
    .select("id")
    .eq("post_id", postId)
    .eq("user_hash", userHash)
    .single();

  return NextResponse.json({ liked: !!data });
}
