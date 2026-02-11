import supabaseServer from '../../../../lib/supabase/server-secret';

//получние данных адреса по id пользователя
export default async function findUser(sender_id: string) {


  const { data: dataUser, error: error4 } = await supabaseServer
    .from("users")
    .select("id, email, phone, name, address_id, is_client, is_dogovor, type_acc, ref_code, created_at, discount, address_id, passport, snils, inn_OOO, name_OOO, fio_gd_OOO, oficial_adress_OOO, actual_address_OOO, kpp_OOO, ogrn_OOO, rs_OOO, bic_OOO, count_refcode_use, corr_score_IP, bic_IP, rs_IP, ogrn_IP, inn_IP, actual_address_IP, fio_IP, comment, corr_score_OOO")
    .eq("id", sender_id)
    .single();
  if (error4) throw new Error(`users sendler error ${JSON.stringify(error4)}`);
  if (!dataUser) throw new Error("users sendler not found");

  return dataUser
}

//admin_comment