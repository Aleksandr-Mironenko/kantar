import supabaseServer from '../../../../lib/supabase/server-secret';

//ищу данные заказа по номеру заказа 
export default async function findOrder(numberOrder: number) {

  const { data: dataOrder, error: error0 } = await supabaseServer
    .from("orders")
    .select("id, order_number, created_at, sender_id, recipient_id, price_full, address_from_id, address_where_id, name_from, name_where, phone_from, phone_where, email_from, email_where, is_paid, heft_full, status, agree, discount_this_send, is_individual, document, loading_date, unloading_date, heft_only_full, volume_only_full, sender_name, sender_type_acc, sender_name_OOO, sender_fio_gd_OOO, sender_fio_IP, recipient_name, recipient_type_acc, recipient_city_name, sender_city_name, recipient_country_name, sender_country_name, recipient_fio_IP, recipient_fio_gd_OOO, recipient_name_OOO, recipient_name_OOO, isSender, product, agree, name_organizer, phone_organizer, email_organizer, organizer_type_acc, organizer_name_OOO, organizer_fio_gd_OOO, organizer_fio_IP, address_organizer_id, cost_of_cargo, descriptionOfCargo")
    .eq("order_number", numberOrder)
    .single();

  if (error0) { throw new Error("order not found") }
  if (!dataOrder) throw new Error("places not found")

  return dataOrder
}
