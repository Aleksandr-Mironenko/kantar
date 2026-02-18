import supabaseServer from '../../../../lib/supabase/server-secret';


export default async function readServices() {
  const { data, error } = await supabaseServer
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}


