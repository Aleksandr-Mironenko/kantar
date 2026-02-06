


import supabaseServer from '../lib/supabase/server-secret';

export default async function findUserType(email: string) {

  // ищем запись в таблице
  const { data, error } = await supabaseServer
    .from("users")
    .select("type_acc")
    .eq("email", email)
    .single();

  //если ошибка - кидаем её выше
  if (error) {
    return "not_user"
  }

  //возвращаем тип найденого пользователя 
  return data.type_acc;
}

