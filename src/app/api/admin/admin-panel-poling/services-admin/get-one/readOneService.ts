import supabaseServer from '../../../../lib/supabase/server-secret';

export default async function readOneServices(url_vizual_name: string) {
  const { data, error } = await supabaseServer
    .from("services")
    .select("*")
    .eq("url_vizual_name", url_vizual_name)
    .single();

  if (error) throw error;

  return data;
}