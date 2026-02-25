import { NextResponse } from "next/server";
import supabaseServer from "../../lib/supabase/server-secret";
import { AuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

interface RegisterRequestBody {
  email: string;
  password: string;
  phone: string;
}

interface RegisterResponse {
  success: boolean;
  jwt?: string;
  refreshToken?: string;
  userProfileId?: string;
  error?: string;
}

interface RegisterRequestBody {
  email: string;
  password: string;
  phone: string;
  roleName?: string; // роль передаём сюда
}

export async function POST(
  req: Request
): Promise<NextResponse<RegisterResponse>> {
  const roleName = "user"
  try {
    const { email, password, phone } = (await req.json()) as RegisterRequestBody;
    const normalizedEmail = email.toLowerCase();

    // Проверяем email в auth.users
    const { data: existingAuthUsers, error: authCheckError } =
      await supabaseServer.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (authCheckError) throw authCheckError;

    if (existingAuthUsers.users.some(u => u.email?.toLowerCase() === normalizedEmail)) {
      return NextResponse.json({ success: false, error: "Email уже зарегистрирован" }, { status: 400 });
    }

    // Проверяем телефон в public.users
    const { data: existingPhone, error: phoneCheckError } =
      await supabaseServer.from("users").select("id").eq("phone", phone).maybeSingle();
    if (phoneCheckError) throw phoneCheckError;
    if (existingPhone) {
      return NextResponse.json({ success: false, error: "Телефон уже зарегистрирован" }, { status: 400 });
    }

    // Создаём auth пользователя
    const { data: authUser, error: createError } = await supabaseServer.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    });

    if (createError) {
      if (createError instanceof AuthApiError) {
        return NextResponse.json({ success: false, error: createError.message }, { status: 400 });
      }
      throw createError;
    }

    if (!authUser?.user) {
      return NextResponse.json({ success: false, error: "Не удалось создать пользователя" }, { status: 500 });
    }

    const authId = authUser.user.id;

    // 4️⃣ Проверяем есть ли гость
    const { data: guest, error: guestError } = await supabaseServer
      .from("users")
      .select("id")
      .or(`email.eq.${normalizedEmail},phone.eq.${phone}`)
      .is("auth_id", null)
      .maybeSingle();

    if (guestError) throw guestError;

    let userProfileId: string;

    if (guest) {
      const { error: updateError } = await supabaseServer
        .from("users")
        .update({ auth_id: authId })
        .eq("id", guest.id);
      if (updateError) throw updateError;
      userProfileId = guest.id;
    } else {
      const { data: createdProfile, error: insertError } = await supabaseServer
        .from("users")
        .insert({
          email: normalizedEmail,
          phone,
          name: "",
          address_id: null,
          is_register: true,
          is_client: false,
          is_dogovor: false,
          type_acc: "noAcc",
          discount: 0,
          auth_id: authId,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      if (!createdProfile) throw new Error("Профиль не создан");
      userProfileId = createdProfile.id;
    }

    // Создание профиля
    const { error: profileError } = await supabaseServer
      .from("profiles")
      .insert({
        id: authId,              // id из auth.users
        email: normalizedEmail,
        phone: phone,
        created_at: new Date().toISOString(),
      });

    if (profileError) throw profileError;

    // Назначение роли (если передали roleName)
    if (roleName) {
      // Получаем id роли из таблицы roles
      const { data: roleData, error: roleError } = await supabaseServer
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single(); // ожидаем ровно одну запись

      if (roleError || !roleData) throw roleError || new Error("Роль не найдена");

      const roleId = roleData.id;

      // Вставляем связь user ↔ role в user_roles
      const { error: assignError } = await supabaseServer
        .from("user_roles")
        .insert({
          user_id: authId,
          role_id: roleId,
        });

      if (assignError) throw assignError;
    }

    // Авто-логин
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const supabaseSSR = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => allCookies,
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            ),
        },
      }
    );

    const { data: loginData, error: loginError } = await supabaseSSR.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (loginError || !loginData.session) {
      return NextResponse.json({ success: false, error: "Не удалось создать сессию" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      jwt: loginData.session.access_token,
      refreshToken: loginData.session.refresh_token,
      userProfileId,
    });

  } catch (err: unknown) {
    console.error(err);
    let message = "Ошибка сервера";
    if (err instanceof AuthApiError) message = err.message;
    else if (err instanceof Error) message = err.message;

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


//В ИТОГЕ СОЗДАНИЕ ПОЛЬЗОВАТЕЛЕЙ!!!