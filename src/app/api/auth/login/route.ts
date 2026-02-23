import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import supabaseServer from "../../lib/supabase/server-secret";
import type { Session } from "@supabase/supabase-js";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}

export async function POST(
  req: Request
): Promise<NextResponse<LoginResponse>> {
  try {
    const cookieStore = await cookies();
    const existingToken = cookieStore.get("access_token");

    // 1️⃣ Если токен уже есть — проверяем его
    if (existingToken?.value) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data } = await supabase.auth.getUser(existingToken.value);

      if (data.user) {
        return NextResponse.json({ success: true });
      }
    }

    // 2️⃣ Если нет — логинимся
    const { email, password } =
      (await req.json()) as LoginRequestBody;

    const normalizedEmail = email.toLowerCase();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const session: Session = data.session;

    // 3️⃣ Проверяем наличие профиля
    const { data: profile, error: profileError } =
      await supabaseServer
        .from("users")
        .select("id")
        .eq("auth_id", session.user.id)
        .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Профиль не найден" },
        { status: 404 }
      );
    }

    // 4️⃣ Создаём ответ и кладём cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 48, // 2 дня
    });

    response.cookies.set("refresh_token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return response;

  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ошибка сервера";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}