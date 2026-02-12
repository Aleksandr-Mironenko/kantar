import supabaseServer from '../../../../../lib/supabase/server-secret';


export default async function readComment(order_number: number) {
  const { data, error } = await supabaseServer
    .from("order_comments")
    .select("*")
    .eq("order_number", order_number)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}