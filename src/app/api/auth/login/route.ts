
// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as LoginRequestBody;

    // Создаём объект ответа, в который Supabase будет писать cookie
    const res = NextResponse.json({ success: true });

    // SSR клиент Supabase с куками
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => {
            const cookieHeader = req.headers.get("cookie") || "";
            return cookieHeader.split("; ").map(c => {
              const [name, ...rest] = c.split("=");
              return { name, value: rest.join("=") };
            });
          },
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set({ name, value, ...options, httpOnly: true, secure: true, sameSite: "lax" })
            ),
        },
      }
    );

    // Логиним через auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Получаем сессию
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Не удалось получить сессию" },
        { status: 500 }
      );
    }
    // Декодируем JWT
    const payload = JSON.parse(
      Buffer.from(session.access_token.split(".")[1], "base64").toString()
    );

    const roles: string[] =
      payload.app_metadata?.roles ??
      payload.claims?.app_metadata?.roles ??
      [];

    const isPerson = roles.includes("admin") ? "admin" :
      roles.includes("user") ? "user" :
        roles.includes("root") ? "root" :
          roles.includes("support") ? "support" :
            roles.includes("manager") ? "manager" : "guest";


    res.headers.set("Content-Type", "application/json");
    const finalResponse = NextResponse.json(
      {
        success: true,
        isPerson,
      },
      {
        headers: res.headers, // переносим куки
      }
    );

    return finalResponse;;



  } catch (err: unknown) {
    let message = "Ошибка сервера";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}