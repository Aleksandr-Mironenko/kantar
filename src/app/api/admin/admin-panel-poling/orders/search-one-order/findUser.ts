import supabaseServer from '../../../../lib/supabase/server-secret';

//получние данных адреса по id пользователя
export default async function findUser(sender_id: string) {


  const { data: dataUser, error: error4 } = await supabaseServer
    .from("users")
    .select("*")
    .eq("id", sender_id)
    .maybeSingle();
  if (error4) throw new Error(`users sendler error ${JSON.stringify(error4)}`);
  if (!dataUser) throw new Error("users sendler not found");

  return dataUser
}

//admin_comment