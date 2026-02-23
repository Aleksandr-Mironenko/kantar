import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import supabaseServer from "../../lib/supabase/server-secret";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  // Инвалидируем refresh token в Supabase (важно!)
  if (refreshToken) {
    await supabaseServer.auth.admin.signOut(refreshToken);
  }

  // Удаляем cookies
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  // Редиректим на главную
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL));
}