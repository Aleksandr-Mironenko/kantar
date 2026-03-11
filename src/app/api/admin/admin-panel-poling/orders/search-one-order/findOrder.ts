import supabaseServer from '../../../../lib/supabase/server-secret';

//ищу данные заказа по номеру заказа 
export default async function findOrder(numberOrder: number) {

  const { data: dataOrder, error: error0 } = await supabaseServer
    .from("orders")
    .select("*")
    .eq("order_number", numberOrder)
    .single();

  if (error0) { throw new Error("order not found") }
  if (!dataOrder) throw new Error("places not found")

  return dataOrder
}
