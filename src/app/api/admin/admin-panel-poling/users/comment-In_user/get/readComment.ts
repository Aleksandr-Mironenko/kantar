import supabaseServer from '../../../../../lib/supabase/server-secret';


export default async function getUserCommentsServer(userId: string) {
  const { data, error } = await supabaseServer
    .from("user_comments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}