import { NextResponse } from "next/server";
import supabaseServer from "../../lib/supabase/server-secret";
import { AuthApiError } from "@supabase/supabase-js";

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

export async function POST(
  req: Request
): Promise<NextResponse<RegisterResponse>> {
  try {
    const { email, password, phone } = (await req.json()) as RegisterRequestBody;
    const normalizedEmail = email.toLowerCase();

    //получаю переданные данные






    // Проверяем email в auth.users
    const { data: existingAuthUsers, error: authCheckError } =
      await supabaseServer.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (authCheckError) throw authCheckError;

    const emailExists = existingAuthUsers.users.some(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return NextResponse.json(
        { success: false, error: "Email уже зарегистрирован" },
        { status: 400 }
      );
    }

    // Проверяем телефон в public.users
    const { data: existingPhone, error: phoneCheckError } =
      await supabaseServer
        .from("users")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

    if (phoneCheckError) throw phoneCheckError;

    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: "Телефон уже зарегистрирован" },
        { status: 400 }
      );
    }


    //на этом этапе у меня точно нет записи с такими данными и его можно регистринровать
    console.log(72, "на этом этапе у меня точно нет записи с такими данными и его можно регистринровать")



    // Создаём auth пользователя
    const { data: authUser, error: createError } =
      await supabaseServer.auth.admin.createUser({
        email: normalizedEmail,
        password: password,
        email_confirm: true,
      });



    //если произошла любая ошибка в момент запроса
    if (createError) {
      if (createError instanceof AuthApiError) {
        return NextResponse.json(
          { success: false, error: createError.message },
          { status: 400 }
        );
      }
      console.log(94, "произошла любая ошибка в момент запроса", createError.message)
      throw createError;
    }


    //если данные не получены значит пользователь не создан
    if (!authUser?.user) {
      console.log(101, "!authUser?.user")
      return NextResponse.json(
        { success: false, error: "Не удалось создать пользователя" },
        { status: 500 }
      );

    }


    //пользователя создать удалось на этом этапе
    const authId = authUser.user.id;
    console.log(112, "пользователь уже создан")



    // 2️⃣ Проверяем есть ли гость
    const { data: guest, error: guestError } = await supabaseServer
      .from("users")
      .select("id")
      .or(`email.eq.${normalizedEmail},phone.eq.${phone}`)
      .is("auth_id", null)
      .maybeSingle();

    //я ищу пользователя по почте или телефону



    if (guestError) {
      console.log(129, "guestError произошла любая ошибка при запросе к users")
      throw guestError
    };

    let userProfileId: string;


    //если все же найден user 
    if (guest) {
      const { error: updateError } = await supabaseServer
        .from("users")
        .update({ auth_id: authId }) //обновляю значение auth_id значением из auth
        .eq("id", guest.id);



      if (updateError) {
        console.log(146, "updateError произошла ошибка при обновлении")
        throw updateError;
      }

      userProfileId = guest.id;//получаю id из supabase user
    } else {
      //user не найден - значит его нужно создать
      const { data: createdProfile, error: insertError } =
        await supabaseServer
          .from("users")
          .insert({
            email: normalizedEmail,
            phone: phone,
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

      //создается профиль


      //любая ошибка при создании записи в user 
      if (insertError) {
        console.log(175, "произошла ошибка при создании записи в user")
        throw insertError
      };

      //профиль не создан  в user данные не получены
      if (!createdProfile) throw new Error("Профиль не создан");
      console.log(173, "профиль не создан  в user данные не получены")
      userProfileId = createdProfile.id; // получаю id созданного пользователя 
    }
    console.log(184, "на этом этапе значение id обновлен в user или создана новая запись в user")





    // Авто-логин
    const { data: loginData, error: loginError } =
      await supabaseServer.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });
    //попытка авторизации

    //любые ошибки 
    if (loginError) {
      console.log(200, "произошла ошибка при попытке авторизации")
      throw loginError
    };

    const session = loginData.session;


    //данные о сессии не получены
    if (!session) {
      console.log(208, "данные о сессии при попытке входа не получены")
      return NextResponse.json(
        { success: false, error: "Не удалось создать сессию" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      jwt: session.access_token,
      refreshToken: session.refresh_token,
      userProfileId,
    });
  } catch (err: unknown) {
    console.error(err);

    let message = "Ошибка сервера";

    if (err instanceof AuthApiError) message = err.message;
    else if (err instanceof Error) message = err.message;

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}