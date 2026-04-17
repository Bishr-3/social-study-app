import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("teacher_token");

  // In a real app, we'd verify the token. Here we check existence as per the simplified requirement.
  if (!token || token.value !== "valid-teacher-token") {
    return NextResponse.json({ isTeacher: false });
  }
  return NextResponse.json({ isTeacher: true });
}
