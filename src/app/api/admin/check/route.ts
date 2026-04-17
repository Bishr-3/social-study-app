import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  const validToken = process.env.ADMIN_SECRET_TOKEN;

  if (!token || !validToken || token.value !== validToken) {
    return NextResponse.json({ isAdmin: false });
  }
  return NextResponse.json({ isAdmin: true });
}
