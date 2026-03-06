import supabaseServer from '../../../lib/supabase/server-public';

//получние данных адреса по id
export default async function findAddress(address_id: number) {
  const supabaseServers = supabaseServer();
  const { data: dataAddress, error: error6 } = await supabaseServers
    .from("addresses")
    .select("id, full_address, country_name,country_zone,country_id,city_name,city_zone,city_id_rf,city_id_foreign,city_zone_id,index")
    .eq("id", address_id)
    .maybeSingle();
  if (error6) throw new Error(`addresses from error  ${JSON.stringify(error6)}`);
  if (!dataAddress) throw new Error("addresses from not found");

  return dataAddress
}