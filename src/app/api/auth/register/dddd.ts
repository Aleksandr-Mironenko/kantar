import { NextResponse } from "next/server";
import supabaseServer from "../../lib/supabase/server-secret";
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

  try {
    const { email, password, phone, roleName = 'user' } = (await req.json()) as RegisterRequestBody;
    const normalizedEmail = email.toLowerCase();



    let isAuth: boolean = false



    // Проверяем email в auth.users
    let matchedUser = null;

    try {

      const { data: loginData } = await supabaseServer.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (loginData?.user) {
        matchedUser = loginData.user;
        isAuth = false; // Пользователь найден — регистрация не нужна
      }
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.status === 400) {
          // Пользователь есть, но пароль неверный
          return NextResponse.json(
            { success: false, error: "Такая почта используется, но неверный пароль" },
            { status: 400 }
          );
        } else if (err.status === 404) {
          // Пользователь не найден — можно создавать
          isAuth = true;
        } else {
          throw err; // другие ошибки
        }
      } else {
        throw err; // не AuthApiError
      }
    }

    // Если пользователь найден — проверяем роль
    if (matchedUser) {
      const authId = matchedUser.id;

      const { data: userRole, error: userRoleError } = await supabaseServer
        .from("user_roles")
        .select("role_id")
        .eq("user_id", authId)
        .single();

      if (userRoleError) throw userRoleError;

      const existingRoleId = userRole.role_id;

      const { data: targetRole, error: targetRoleError } = await supabaseServer
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single();

      if (targetRoleError) throw targetRoleError;

      const targetRoleId = targetRole.id;

      if (existingRoleId === targetRoleId) {
        return NextResponse.json(
          { success: false, error: "Этот mail уже зарегистрирован с этой ролью" },
          { status: 400 }
        );
      }
    }


    // Создаём auth пользователя
    let authUser: { user: { id: string } | null } = { user: null };

    if (isAuth) {
      try {
        // Пытаемся создать пользователя
        const { data: createUser, error: createError } = await supabaseServer.auth.admin.createUser({
          email: normalizedEmail,
          phone,
          password,
          email_confirm: true,
        });

        if (createError) throw createError;

        if (!createUser?.user) {//любая ошибка при создании
          return NextResponse.json({ success: false, error: "Не удалось создать пользователя" }, { status: 500 });
        }

        authUser = createUser;

      } catch (err) {
        if (
          err instanceof AuthApiError &&
          err.message.toLowerCase().includes("already")
        ) {
          // Пользователь уже создан параллельно — подхватываем его через signIn
          const { data: loginData, error: loginError } = await supabaseServer.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          if (loginError || !loginData?.user) {
            throw new Error("Не удалось подхватить уже созданного пользователя");
          }

          authUser = loginData;

        } else {
          throw err; // другие ошибки
        }
      }

      // Проверка на null
      if (!authUser.user) {
        throw new Error("Не удалось создать или получить пользователя");
      }
    }
    let authId: string;

    if (matchedUser) {//проверка был ли реганый пользователь 
      authId = matchedUser.id; //если был беру оттуда id
    } else {
      authId = authUser.user!.id; // если нет значит я его создавал 
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

      if (guestError) throw guestError;



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
        .upsert({
          user_id: authId,
          role_id: roleId,
        },
          { onConflict: "user_id,role_id" });

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

// -------------------------------------------------------


import { NextResponse } from "next/server";
import supabaseServer from "../../lib/supabase/server-secret";
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

  try {
    const { email, password, phone, roleName = 'user' } = (await req.json()) as RegisterRequestBody;
    const normalizedEmail = email.toLowerCase();



    let isAuth: boolean = false

    // Проверяем email + phone в auth.users
    const { data: existingAuthUsers, error: authCheckError } =
      await supabaseServer.auth.admin.listUsers({ page: 1, perPage: 1000000000 });

    if (authCheckError) throw authCheckError;

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

      if (userRoleError) throw userRoleError;

      const existingRoleId = userRole.role_id;

      // b) Получаем roleId роли, которую пытаются зарегистрировать
      const { data: targetRole, error: targetRoleError } = await supabaseServer
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single();

      if (targetRoleError) throw targetRoleError;

      const targetRoleId = targetRole.id;



      const { data: roleLastName, error: roleError } = await supabaseServer
        .from("roles")
        .select("name")
        .eq("id", existingRoleId)
        .single(); // ожидаем ровно одну запись

      if (roleError || !roleLastName) throw roleError || new Error("Роль не найдена");

      const existingRoleName = roleLastName.name;







      // c) Сравниваем роли
      if (existingRoleId === targetRoleId) {
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

        // если пользователь уже создан параллельно
        if (
          createError instanceof AuthApiError &&
          createError.message.toLowerCase().includes("already")
        ) {

          // повторно получаем список пользователей
          const { data: retryUsers, error: retryError } =
            await supabaseServer.auth.admin.listUsers({
              page: 1,
              perPage: 1000000000,
            });

          if (retryError) throw retryError;

          const retryMatched = retryUsers.users.find(
            u =>
              u.email?.toLowerCase() === normalizedEmail &&
              u.phone === phone
          );

          if (!retryMatched) {
            throw createError;
          }

          authUser = { user: retryMatched };

        } else {
          throw createError;
        }
      }

      if (!createUser?.user) {
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

      if (guestError) throw guestError;



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
        .upsert({
          user_id: authId,
          role_id: roleId,
        },
          { onConflict: "user_id,role_id" });

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

// ---------------------------------------------------


import { NextResponse } from "next/server";
import supabaseServer from "../../lib/supabase/server-secret";
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

  try {
    const { email, password, phone, roleName = 'user' } = (await req.json()) as RegisterRequestBody;
    const normalizedEmail = email.toLowerCase();



    let isAuth: boolean = false

    // Проверяем email + phone в auth.users
    const { data: existingAuthUsers, error: authCheckError } =
      await supabaseServer.auth.admin.listUsers({ page: 1, perPage: 1000000000 });

    if (authCheckError) throw authCheckError;

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

      if (userRoleError) throw userRoleError;

      const existingRoleId = userRole.role_id;

      // b) Получаем roleId роли, которую пытаются зарегистрировать
      const { data: targetRole, error: targetRoleError } = await supabaseServer
        .from("roles")
        .select("id")
        .eq("name", roleName)
        .single();

      if (targetRoleError) throw targetRoleError;

      const targetRoleId = targetRole.id;



      const { data: roleLastName, error: roleError } = await supabaseServer
        .from("roles")
        .select("name")
        .eq("id", existingRoleId)
        .single(); // ожидаем ровно одну запись

      if (roleError || !roleLastName) throw roleError || new Error("Роль не найдена");

      const existingRoleName = roleLastName.name;







      // c) Сравниваем роли
      if (existingRoleId === targetRoleId) {
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
          return NextResponse.json({ success: false, error: createError.message }, { status: 400 });
        }
        throw createError;
      }

      if (!createUser?.user) {
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

      if (guestError) throw guestError;



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
        .upsert({
          user_id: authId,
          role_id: roleId,
        },
          { onConflict: "user_id,role_id" });

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