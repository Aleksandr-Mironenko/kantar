import { NextResponse } from "next/server";
import supabaseServer from "../../lib/supabase/server-secret";
import supabaseServerPublic from "../../lib/supabase/server-public";
import { AuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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
  console.log("SERVICE ROLE:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  try {
    const { email, password, phone, roleName = 'user' } = (await req.json()) as RegisterRequestBody;
    const normalizedEmail = email.toLowerCase();



    let isAuth: boolean = false

    // Проверяем email + phone в auth.users
    const { data: existingAuthUsers, error: authCheckError } =
      await supabaseServer.auth.admin.listUsers({ page: 1, perPage: 1000000000 });

    if (authCheckError) {
      console.log("ошибка 39")
      throw authCheckError
    };

    // Ищем пользователя с совпадающими email и phone
    const matchedUser = existingAuthUsers.users.find(
      u => u.email?.toLowerCase() === normalizedEmail && u.phone === phone
    );

    if (matchedUser) {
      const authId = matchedUser.id;

      // a) Получаем роль пользователя из user_roles
      const { data: userRole, error: userRoleError } = await supabaseServer
        .from("user_roles")
        .select("role_id")
        .eq("user_id", authId)
        .single();

      if (userRoleError) {
        console.log("ошибка 59")
        throw userRoleError
      };

      const existingRoleId = userRole.role_id;

      // b) Получаем roleId роли, которую пытаются зарегистрировать
      const { data: targetRole, error: targetRoleError } = await supabaseServer
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single();

      if (targetRoleError) {
        console.log("ошибка 73")
        throw targetRoleError
      };

      const targetRoleId = targetRole.id;



      const { data: roleLastName, error: roleError } = await supabaseServer
        .from("roles")
        .select("name")
        .eq("id", existingRoleId)
        .single(); // ожидаем ровно одну запись

      if (roleError || !roleLastName) {
        console.log("ошибка 88")
        throw roleError || new Error("Роль не найдена")
      };

      const existingRoleName = roleLastName.name;

      // c) Сравниваем роли
      if (existingRoleId === targetRoleId) {
        console.log("return 102")

        return NextResponse.json(
          { success: false, error: "Этот mail с этим телефоном уже зарегистрированы" },
          { status: 400 }
        );
      } else {
        const { data: loginCheck, error: loginErrorCheck } =
          await supabaseServer.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

        if (loginErrorCheck) {
          console.log("return 116")
          return NextResponse.json(
            {
              success: false,
              error: `У вас уже есть учётная запись для регистрации в качестве ${existingRoleName ? existingRoleName : "другой роли"}. Введите старый пароль.`,
            },
            { status: 400 }
          );
        } else if (loginCheck?.session) {
          isAuth = false
        }

      }

      // Если роли разные — разрешаем регистрацию
      // (например, пользователь уже есть как user, но регистрируется как admin)
    } else {
      isAuth = true
    }







    // дублирующий код
    // if (roleName === 'user') {
    //   // Проверяем телефон или email в public.users
    //   const { data: existingUser, error: checkError } =
    //     await supabaseServer
    //       .from("users")
    //       .select("id")
    //       .eq("phone", phone).eq("email", normalizedEmail)
    //       .maybeSingle();

    //   if (checkError) throw checkError;

    //   if (existingUser) {
    //     //тут ошибку кидать не нужно нужно просто пропустить тогда
    //     //
    //     return NextResponse.json(
    //       { success: false, error: "Телефон или email уже зарегистрированы" },
    //       { status: 400 }
    //     );
    //   }
    // }


    // Создаём auth пользователя
    let authUser: { user: { id: string } | null } = { user: null }

    if (isAuth) {
      const { data: createUser, error: createError } = await supabaseServer.auth.admin.createUser({
        email: normalizedEmail,
        phone,
        password,
        email_confirm: true,
      });

      if (createError) {
        if (createError instanceof AuthApiError) {
          console.log("return 178")
          return NextResponse.json({ success: false, error: createError.message }, { status: 400 });
        }
        console.log("ошибка 181")
        throw createError;
      }

      if (!createUser?.user) {
        console.log("return 186")
        return NextResponse.json({ success: false, error: "Не удалось создать пользователя" }, { status: 500 });
      }
      authUser = createUser;
    }
    let authId: string;

    if (matchedUser) {
      authId = matchedUser.id;
    } else {
      authId = authUser.user!.id;
    }

    let userProfileId: string | undefined = authId;

    if (roleName === 'user') {
      // Проверяем есть ли гость
      const { data: guest, error: guestError } = await supabaseServer
        .from("users")
        .select("id")
        .eq("phone", phone).eq("email", normalizedEmail)
        .is("auth_id", null)
        .maybeSingle();

      if (guestError) {
        console.log("ошибка 211")
        throw guestError
      };



      if (guest) {
        const { error: updateError } = await supabaseServer
          .from("users")
          .update({ auth_id: authId })
          .eq("id", guest.id);
        if (updateError) {
          console.log("ошибка 223")
          throw updateError
        };
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
        if (insertError) {
          console.log("SERVICE ROLE:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

          console.log("ошибка 245")
          throw insertError
        };
        if (!createdProfile) {
          console.log("ошибка 249")
          throw new Error("Профиль не создан")
        };
        userProfileId = createdProfile.id;
      }
    }

    // Создание профиля
    const { error: profileError } = await supabaseServer
      .from("profiles")
      .upsert({
        id: authId,              // id из auth.users
        email: normalizedEmail,
        phone: phone,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.log("ошибка 266")
      throw profileError
    };

    // Назначение роли (если передали roleName)
    if (roleName) {
      // Получаем id роли из таблицы roles
      const { data: roleData, error: roleError } = await supabaseServer
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single(); // ожидаем ровно одну запись

      if (roleError || !roleData) {
        console.log("ошибка 280")
        throw roleError || new Error("Роль не найдена")
      };

      const roleId = roleData.id;

      // Вставляем связь user ↔ role в user_roles
      const { error: assignError } = await supabaseServer
        .from("user_roles")
        .upsert({
          user_id: authId,
          role_id: roleId,
        },
          { onConflict: "user_id,role_id" });

      if (assignError) {
        console.log("ошибка 296")
        throw assignError
      };
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
      console.log("return 325")
      return NextResponse.json({ success: false, error: "Не удалось создать сессию" }, { status: 500 });
    }
    console.log("return 328")
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
    console.log("return 341")
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


//В ИТОГЕ СОЗДАНИЕ ПОЛЬЗОВАТЕЛЕЙ!!!