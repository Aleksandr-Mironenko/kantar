import supabaseServer from '../../../../lib/supabase/server-secret';

//ищу детали мест по номеру заказам
export default async function findPlace(numberOrder: number) {

  const { data: arrayPlacesInOrder, error: error1 } = await supabaseServer
    .from("order_places")
    .select("*")
    .eq("order_number", numberOrder)

  if (error1) throw new Error("places not found");
  if (!arrayPlacesInOrder.length) throw new Error("places not found")

  return arrayPlacesInOrder
}

