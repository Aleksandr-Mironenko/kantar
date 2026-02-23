import supabaseServer from '../lib/supabase/server-secret';
import { CreateUserResult, DataCreateUser } from '../../components/DTO/DTO'



export async function getOrCreateUser(data: DataCreateUser): Promise<CreateUserResult> {
  // проверяем наличие пользователя в бд по email или телефону
  const { data: existing } = await supabaseServer
    .from("users")
    .select("id,name,type_acc,name_OOO,fio_gd_OOO,fio_IP")
    .or(`email.eq.${data.email},phone.eq.${data.phone}`)
    .maybeSingle();

  //если нашли - возвращаем id и НУжНЫЕ ПОЛЯ, отрезаем продолжение функции
  if (existing) {
    return {
      id: existing.id,
      name: existing.name,
      type_acc: existing.type_acc,
      name_OOO: existing.name_OOO,
      fio_gd_OOO: existing.fio_gd_OOO,
      fio_IP: existing.fio_IP
    };
  }

  // создаём запись в таблице
  const { data: created, error } = await supabaseServer
    .from("users")
    .insert({
      email: data.email,
      phone: data.phone,
      name: data.name,
      address_id: 56,
      is_register: false,
      is_client: data.isClient,
      is_dogovor: false,
      type_acc: data.typeAcc,
      ref_code: null,
      count_refcode_use: 0,
      discount: data.discount,
      passport: null,
      snils: null,
      fio_gd_OOO: null,
      name_OOO: null,
      oficial_adress_OOO: null,
      actual_address_OOO: null,
      inn_OOO: null,
      kpp_OOO: null,
      ogrn_OOO: null,
      rs_OOO: null,
      bic_OOO: null,
      corr_score_OOO: null,
      comment: null,
      fio_IP: null,
      actual_address_IP: null,
      inn_IP: null,
      ogrn_IP: null,
      rs_IP: null,
      bic_IP: null,
      corr_score_IP: null,
    })
    .select("id,name,type_acc,name_OOO,fio_gd_OOO,fio_IP")
    .single();

  //если ошибка - кидаем её выше
  if (error) throw error;

  //возвращаем id и НУжНЫЕ ПОЛЯ, созданного пользователя или найденного
  return {
    id: created.id,
    name: created.name,
    type_acc: created.type_acc,
    name_OOO: created.name_OOO,
    fio_gd_OOO: created.fio_gd_OOO,
    fio_IP: created.fio_IP
  }
}