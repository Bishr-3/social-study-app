import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  if (password !== adminPassword) {
    // عمداً نعطي رسالة مبهمة لمنع هجمات التخمين
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // إنشاء Cookie مشفرة صالحة لـ 3 أيام
  const cookieStore = await cookies();
  cookieStore.set("admin_token", process.env.ADMIN_SECRET_TOKEN!, {
    httpOnly: true,       // لا يمكن لـ JavaScript قراءتها
    secure: true,         // HTTPS فقط
    sameSite: "strict",   // حماية CSRF
    maxAge: 60 * 60 * 24 * 3, // 3 أيام
    path: "/",
  });

  return NextResponse.json({ success: true });
}
