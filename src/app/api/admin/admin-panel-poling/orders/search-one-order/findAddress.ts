
import supabaseServer from '../../../../lib/supabase/server-secret';

//получние данных адреса по id
export default async function findAddress(address_id: number) {

  const { data: dataAddress, error: error6 } = await supabaseServer
    .from("addresses")
    .select("*")
    .eq("id", address_id)
    .single();
  if (error6) throw new Error(`addresses from error  ${JSON.stringify(error6)}`);
  if (!dataAddress) throw new Error("addresses from not found");

  return dataAddress
}