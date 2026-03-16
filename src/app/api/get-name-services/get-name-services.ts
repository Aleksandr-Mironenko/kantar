import supabaseServer from '@/app/api/lib/supabase/server-public';

//получение всех url сервисов
export default async function getNameServices() {
  const supabaseServers = supabaseServer();
  const { data, error } = await supabaseServers
    .from("services")
    .select("url_vizual_name")
  if (error) {
    console.error('Ошибка получения данных:', error);
    return null;
  }
  const services = data.map(el => el.url_vizual_name)

  return services; // массив строк
}