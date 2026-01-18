export type TableOrdersRecord = {
  id: number,
  sender_id: number,
  recipient_id: number
  address_from_id: number,
  address_where_id: number,
  name_from: string,
  name_where: string,
  phone_from: string,
  phone_where: string,
  email_from: string,
  email_where: string,
  discount_this_send: number,
  price_full: number,
  is_paid: boolean,
  heft_full: number,
  status: "new" | // новый заказ 
  "pickup required (processed)" | // требуется забор (обработано)
  "awaiting payment (shipped)" | // ожидает оплаты(отправлен)
  "awaiting payment (not shipped)" | // ожидает оплаты(не отправлен)
  "in transit" | // в пути
  "delivery pending" | // согласовывается вручение
  "in transit (delivery)" | // в пути (вручение)
  "delivered" | // вручено
  "canceled", //отменено
  is_individual: boolean,
};
export type TableOrdersRecordWithEvent = TableOrdersRecord & { eventType: string }