import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;
    
    // Check admin authorization
    if (adminToken !== "valid-admin-token") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
    }

    // Get current multiple likes setting
    const { data: allowMultipleLikes, error } = await supabaseAdmin.rpc("get_app_setting", {
      p_setting_key: "allow_multiple_likes"
    });

    if (error) throw error;

    return NextResponse.json({
      setting: "allow_multiple_likes",
      enabled: allowMultipleLikes,
      message: allowMultipleLikes ? "تم تفعيل multiple likes" : "multiple likes معطل"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error getting multiple likes setting:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;
    
    // Check admin authorization
    if (adminToken !== "valid-admin-token") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
    }

    const { enable } = await request.json() as { enable: boolean };

    // Update the setting
    const { data: result, error } = await supabaseAdmin.rpc("update_app_setting", {
      p_setting_key: "allow_multiple_likes",
      p_setting_value: enable,
      p_updated_by: "admin"
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      setting: "allow_multiple_likes",
      enabled: enable,
      message: enable ? "✅ تم تفعيل multiple likes" : "✅ تم تعطيل multiple likes"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error updating multiple likes setting:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
