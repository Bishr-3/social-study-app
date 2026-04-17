import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("teacher_token");

  if (!token || token.value !== "valid-teacher-token") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, postId, rating, isChoice } = await request.json();

  if (action === "rate") {
    const { error } = await supabaseAdmin
      .from("posts")
      .update({ teacher_rating: rating })
      .eq("id", postId);
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "toggleChoice") {
    const { error } = await supabaseAdmin
      .from("posts")
      .update({ is_teacher_choice: isChoice })
      .eq("id", postId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
