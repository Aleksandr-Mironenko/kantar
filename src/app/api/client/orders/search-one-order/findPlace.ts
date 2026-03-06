import supabaseServer from '../../../lib/supabase/server-public';

//ищу детали мест по номеру заказам
export default async function findPlace(numberOrder: number) {
  const supabaseServers = supabaseServer();
  const { data: arrayPlacesInOrder, error: error1 } = await supabaseServers
    .from("order_places")
    .select("id, order_number, order_id,length,width,height,heft,fullPrice,price,nds,volume,places_personal_id,status_place,sumPlaces")
    .eq("order_number", numberOrder)

  if (error1) throw new Error("places not found");
  if (!arrayPlacesInOrder.length) throw new Error("places not found")

  return arrayPlacesInOrder
}

