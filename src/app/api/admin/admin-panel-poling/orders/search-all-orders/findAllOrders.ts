import supabaseServer from '../../../../lib/supabase/server-secret';

//ищу данные всей таблицы заказов с пагинацией
export default async function findAllOrders(request: Request) {

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Number(searchParams.get('limit') ?? 10));
  const offset = (page - 1) * limit;

  const from = offset;
  const to = offset + limit - 1;


  const { data: arrayOrderObjData, error, count } = await supabaseServer
    .from("orders")
    .select("id, order_number, created_at, sender_id, recipient_id, price_full, address_from_id, address_where_id, name_from, name_where, phone_from, phone_where, email_from, email_where, is_paid, heft_full, status, agree, discount_this_send, is_individual, document, loading_date, unloading_date, heft_only_full, volume_only_full, sender_name, sender_type_acc, sender_name_OOO, sender_fio_gd_OOO, sender_fio_IP, recipient_name, recipient_type_acc, recipient_city_name, sender_city_name, recipient_country_name, sender_country_name, recipient_fio_IP, recipient_fio_gd_OOO, recipient_name_OOO, recipient_name_OOO, isSender, product", { count: 'exact' })
    .order('order_number', { ascending: false })
    // .order('created_at', { ascending: false })


    // senderName: string,
    //   senderType_acc: Type_acc,
    //   senderName_OOO: string | null,
    //   senderFio_gd_OOO: string | null,
    //   senderFio_IP: string | null,
    //   recipientName: string,
    //   recipientType_acc: Type_acc,
    //   recipientName_OOO: string | null,
    //   recipientFio_gd_OOO: string | null,
    //   recipientFio_IP: string | null,
    //   sender_country_name: string,
    //   recipient_country_name: string,
    //   sender_city_name: string | null,
    //   recipient_city_name: string | null,
    //   isSender: boolean


    .range(from, to);
  if (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }

  const totalPages = Math.ceil((count ?? 0) / limit);
  return { arrayOrderObjData, count, page, limit, totalPages }
}