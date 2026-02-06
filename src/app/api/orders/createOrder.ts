import supabaseServer from '../lib/supabase/server-secret';
import { DataCreateOrder, orderIdForDataUploadFiles } from '../../components/DTO/DTO'

export async function createOrder(
  data: DataCreateOrder, isInternal: boolean, nds: number
): Promise<orderIdForDataUploadFiles> {



  const { data: order, error } = await supabaseServer
    .from("orders")
    .insert({
      sender_id: data.senderId,
      recipient_id: data.recipientId,
      address_from_id: data.senderAddressId,
      address_where_id: data.recipientAddressId,
      name_from: data.nameFrom,
      name_where: data.nameWhere,
      phone_from: data.phoneFrom,
      phone_where: data.phoneWhere,
      email_from: data.emailFrom,
      email_where: data.emailWhere,
      discount_this_send: data.discount,
      price_full: isInternal ? Math.ceil(data.price * nds) : Math.ceil(data.price),
      is_paid: data.isPaid,
      heft_full: data.isFinalHeft,
      heft_only_full: data.isFinalOnlyHeft,
      volume_only_full: data.isFinalOnlyVolume,
      status: data.status,
      agree: data.agree,
      is_individual: data.isIndividual,
      document: data.document,
      loading_date: data.loadingDate,
      unloading_date: data.unloadingDate,
      sender_name: data.senderName,
      sender_type_acc: data.senderType_acc,
      sender_name_OOO: data.senderName_OOO,
      sender_fio_gd_OOO: data.senderFio_gd_OOO,
      sender_fio_IP: data.senderFio_IP,
      recipient_name: data.recipientName,
      recipient_type_acc: data.recipientType_acc,
      recipient_name_OOO: data.recipientName_OOO,
      recipient_fio_gd_OOO: data.recipientFio_gd_OOO,
      recipient_fio_IP: data.recipientFio_IP,
      sender_country_name: data.sender_country_name,
      recipient_country_name: data.recipient_country_name,
      sender_city_name: data.sender_city_name,
      recipient_city_name: data.recipient_city_name,
      isSender: data.isSender ? "sender" : "recipient",
      product: data.product
    })
    .select("id,order_number")
    .single();

  //если ошибка - кидаем её выше
  if (error) throw error;
  //возвращаем id созданного заказа 
  return [order.id, order.order_number] as orderIdForDataUploadFiles;
}  