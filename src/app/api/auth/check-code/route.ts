import retry from '../../orders/lib/function/retry';
import supabaseServer from '@/app/api/lib/supabase/server-secret';

export async function POST(req: Request) {
  const { code, phone, email } = await req.json();

  const { error: error1, data: existing } = await retry(async () => await supabaseServer
    .from("auth_codes") // ищем в таблице auth_codes
    .select("*") // выбираем все поля
    .or(`phone.eq.${phone},email.eq.${email}`) // где телефон или email совпадает с введёнными
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
  console.log("табличный code", record.code, typeof record.code)
  console.log("клиентский code", code, typeof code)
  console.log("сравнение", record.code === code)
  const isMatch = record.code === code;


  // функция удаления
  const deleteRecord = async () => {
    const { error: error2 } = await retry(async () => await supabaseServer
      .from("auth_codes")
      .delete()
      .eq("id", record.id)
      , { retries: 5, delay: 100 });

    if (error2) {
      console.log("Ошибка при удалении старого кода auth/check-code/route:", error2);
      // return Response.json({ sendCode: false });
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