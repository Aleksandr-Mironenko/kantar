import supabaseServer from '../../lib/supabase/server-secret';
import { sendEmail } from "../../lib/helpers/sendEmail"
import { sendSMS } from "../../lib/helpers/sendSms";
import retry from '../../orders/lib/function/retry';
export async function POST(req: Request) {
  const { phone, email, fromDatabase } = await req.json();

  const allowedTables = ["auth_codes", "auth_codes_login"];

  if (!allowedTables.includes(fromDatabase)) {
    return Response.json({ sendCode: false, error: "invalid_table" });
  }

  let resolvedPhone = phone;

  if (!phone && email) {
    const { error, data } = await retry(async () =>
      supabaseServer
        .from("users")
        .select("phone")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1),
      { retries: 5, delay: 100 }
    );

    if (error) {
      return Response.json({ sendCode: false, error: "db_error" });
    }

    const foundPhone = data?.[0]?.phone;



    resolvedPhone = foundPhone;
  }




  // проверка входных данных на наличие
  if (!resolvedPhone && !email) {
    return Response.json({ sendCode: false, error: "phone_or_email_required" });
  }

  //находим знаёмые коды за последние 24 часа
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const since10min = new Date(Date.now() - 10 * 60 * 1000).toISOString();



  //проверка есть ли код за последние 10 минут
  const { error: error0, data: existing10min } = await retry(async () => await supabaseServer
    .from(fromDatabase) // ищем в таблице
    .select("*") // выбираем все поля
    .eq("phone", resolvedPhone)
    .eq("email", email)
    .gte("created_at", since10min) // и создан позже чем 10 мин назад
    .order("created_at", { ascending: false })   // сортируем по дате создания по убыванию
    .limit(1), { retries: 5, delay: 100 }); // ограничиваем результат одним
  if (error0) {
    console.log("Ошибка при поиске старого кода auth/send-code/route/error0", error0)
  }
  if (!existing10min || existing10min.length === 0) {

    // проверка, есть ли код за последние сутки используя retry для уверенности что не будет случайной ошибки
    const { error: error1, data: existing } = await retry(async () => await supabaseServer
      .from(fromDatabase) // ищем в таблице auth_codes
      .select("*") // выбираем все поля
      .eq("phone", resolvedPhone)
      .eq("email", email)    // где телефон или email совпадает с введёнными
      .gte("created_at", since) // и создан позже чем 24 часа назад
      .order("created_at", { ascending: false })   // сортируем по дате создания по убыванию
      .limit(1), { retries: 5, delay: 100 }); // ограничиваем результат одним




    // 2. Если есть — удаляем
    if (!error1 && existing?.[0]) {
      const { error: error2 } = await retry(async () => await supabaseServer
        .from(fromDatabase)
        .delete()
        .eq("id", existing[0].id)
        , { retries: 5, delay: 100 });

      if (error2) {
        console.log(98, "Ошибка при удалении старого кода auth/send-code/route/error2:", error2);
      }
    }

    // 3. Создаем новый код
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 цыфры кода для проверки

    const { error: error3 } = await retry(async () => await supabaseServer
      .from(fromDatabase)
      .insert({
        phone: phone ? phone : resolvedPhone,
        email,
        code,
        is_entry: false,
        is_check: false,
        expires_at: new Date(Date.now() + 10 * 60 * 1000)// 10 минут срок жизни кода
      }), { retries: 5, delay: 100 });

    if (error3) {
      console.log("Ошибка при создании нового кода auth/send-code/route:", error3);
      return Response.json({ sendCode: false });
    }

    const tasks: Promise<unknown>[] = []

    tasks.push(

      //отправка сообщения клиенту 
      sendEmail(
        email,
        `Код поодтверждения KANTAR`,
        `<p>Ваш код для входа: <strong>${code}</strong></p><p>Код действителен 10 минут</p>`,
        `Проверочный код KANTAR`
      ),

      //отправка смс клиенту 
      sendSMS(resolvedPhone,
        `Ваш код подтверждения: ${code} `,
      )

      // sendSMS(`${client === "sender" ? phoneFrom : phoneWhere} `,
      // `${orderNumbers && `Номер вашего заказа: ${JSON.stringify(orderNumbers?.orderId)}`}
      //   ${sms.messageUserSMS} `),
    )
    const results = await Promise.allSettled(tasks)

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.log("Ошибка в send-code:", index, result.reason)
      }
    })
    return Response.json({ sendCode: true, lastCode: false });
  } else {
    return Response.json({ sendCode: true, lastCode: true });
  }
} 