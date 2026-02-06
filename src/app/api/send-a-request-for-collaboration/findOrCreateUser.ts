


import supabaseServer from '../lib/supabase/server-secret';
import { toCorrectUserAcc } from '../../components/DTO/DTO'



export default async function findOrCreateUser(email: string, updates: Partial<toCorrectUserAcc>) {


  // удаляем undefined, чтобы не перетирать поля
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
  );

  // обновляю запись в таблице
  const { data, error } = await supabaseServer
    .from("users")
    .update(cleanUpdates)
    .eq("email", email)
    .select("id")
    .single();

  //если ошибка - кидаем её выше
  if (error) throw error;

  //возвращаем id созданного пользователя или найденного
  return data.id;// as number;
}

