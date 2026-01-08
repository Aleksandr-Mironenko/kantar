import supabaseServer from '@/app/api/lib/supabase/server-secret';
import { DataCreateOrder } from '@/app/components/DTO/DTO'

export async function createOrder(
  data: DataCreateOrder, isInternal: boolean, nds: number
): Promise<number[]> {



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
      status: data.status,
      agree: data.agree,
      is_individual: data.price == 0
    })
    .select("id,order_number")
    .single();

  //если ошибка - кидаем её выше
  if (error) throw error;
  //возвращаем id созданного заказа
  return [order.id, order.order_number] as number[];
}