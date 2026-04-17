import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// دالة للتحقق من صلاحية الأدمن
async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  const validToken = process.env.ADMIN_SECRET_TOKEN;
  return !!(token && validToken && token.value === validToken);
}

// إنشاء Supabase client بمفتاح Service Role (يتخطى كل قواعد RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // مفتاح سري لا يُرسل للمتصفح أبداً
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { action, postId, commentId, likesDelta, title, content, imageUrl } = body;
  const supabaseAdmin = getAdminClient();

  switch (action) {
    case "deletePost": {
      if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });
      // حذف التعليقات أولاً
      await supabaseAdmin.from("comments").delete().eq("post_id", postId);
      // حذف المنشور
      const { error } = await supabaseAdmin.from("posts").delete().eq("id", postId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    case "deleteComment": {
      if (!commentId) return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
      const { error } = await supabaseAdmin.from("comments").delete().eq("id", commentId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    case "adjustLikes": {
      if (!postId || likesDelta === undefined)
        return NextResponse.json({ error: "Missing postId or likesDelta" }, { status: 400 });
      // اجلب القيمة الحالية أولاً
      const { data } = await supabaseAdmin.from("posts").select("likes").eq("id", postId).single();
      const newLikes = Math.max(0, (data?.likes || 0) + likesDelta);
      const { error } = await supabaseAdmin.from("posts").update({ likes: newLikes }).eq("id", postId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, newLikes });
    }

    case "updatePost": {
      if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });
      
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (imageUrl !== undefined) updateData.image_url = imageUrl;

      const { error } = await supabaseAdmin
        .from("posts")
        .update(updateData)
        .eq("id", postId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
