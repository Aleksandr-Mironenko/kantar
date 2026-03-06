import retry from '../../orders/lib/function/retry';
import supabaseServer from '../../lib/supabase/server-secret';

export async function POST(req: Request) {
  const { code, phone, email, fromDatabase } = await req.json();

  const allowedTables = ["auth_codes", "auth_codes_login"];

  if (!allowedTables.includes(fromDatabase)) {
    return Response.json({ sendCode: false, error: "invalid_table" });
  }

  let resolvedPhone = phone;

  if (!phone && email) {
    const { error, data } = await retry(async () =>
      supabaseServer
        .from(fromDatabase)
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

    if (!foundPhone) {
      return Response.json({ sendCode: false, error: "phone_not_found" });
    }

    resolvedPhone = foundPhone;
  }

  if (!resolvedPhone && !email) {
    return Response.json({ sendCode: false, error: "phone_or_email_required" });
  }

  const { error: error1, data: existing } = await retry(async () => await supabaseServer
    .from(fromDatabase) // ищем в таблице auth_codes
    .select("*") // выбираем все поля
    .eq("phone", resolvedPhone)
    .eq("email", email)
    .order("created_at", { ascending: false })   // сортируем по дате создания по убыванию
    .limit(1), { retries: 5, delay: 100 }); // ограничиваем результат одним

  // 2. Если есть — удаляем
  if (error1 || !existing?.[0]) {
    return Response.json({ valid: false });
  }

  //значение записи последнего кода
  const record = existing[0];

  const now = new Date();

  //время истечения кода
  const expiresAt = new Date(record.expires_at);

  //время истекло
  const isExpired = expiresAt <= now;

  //код неверный
  const isMatch = record.code === code;


  // функция удаления
  const deleteRecord = async () => {
    const { error: error2 } = await retry(async () => await supabaseServer
      .from(fromDatabase)
      .delete()
      .eq("id", record.id)
      , { retries: 5, delay: 100 });

    if (error2) {
      console.log("Ошибка при удалении старого кода auth/check-code/route:", error2);
    }
  }

  // код неверный
  if (!isMatch) {
    if (isExpired) {
      //время истекло
      await deleteRecord()
      return Response.json({ checkCode: false, timer: false });
    } else {
      //время не истекло
      return Response.json({ checkCode: false, timer: true });
    }
  }

  // код верный
  if (isMatch) {
    if (isExpired) {
      //время истекло
      await deleteRecord()
      return Response.json({ checkCode: true, timer: false });
    } else {
      //время не истекло
      await deleteRecord()
      return Response.json({ checkCode: true, timer: true });
    }
  }
}