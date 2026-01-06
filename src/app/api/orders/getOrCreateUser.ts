import supabaseServer from '@/app/api/lib/supabase/server-secret';
import { DataCreateUser } from '@/app/components/DTO/DTO'

export async function getOrCreateUser(data: DataCreateUser): Promise<number> {
  // проверяем наличие пользователя в бд по email или телефону
  const { data: existing } = await supabaseServer
    .from("users")
    .select("id")
    .or(`email.eq.${data.email},phone.eq.${data.phone}`)
    .maybeSingle();

  //если нашли - возвращаем id и отрезаем продолжение функции
  if (existing) {
    return existing.id as number;
  }

  // создаём запись в таблице
  const { data: created, error } = await supabaseServer
    .from("users")
    .insert({
      email: data.email,
      phone: data.phone,
      name: data.name,
      is_client: data.isClient,
      type_acc: data.typeAcc,
      discount: data.discount,
    })
    .select("id")
    .single();

  //если ошибка - кидаем её выше
  if (error) throw error;

  //возвращаем id созданного пользователя или найденного
  return created.id as number;
}