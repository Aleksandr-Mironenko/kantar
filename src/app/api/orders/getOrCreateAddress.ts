import supabaseServer from '../lib/supabase/server-secret';
import { DataCreateAddress } from '../../components/DTO/DTO'

type CreatedAddressResult = {
  id: number;
  country_name: string;
  city_name: string | null;
};

export async function getOrCreateAddress(
  data: DataCreateAddress
): Promise<CreatedAddressResult> {

  // проверяем наличие адреса в бд совместно по полному адресу и индексу
  const { data: existing } = await supabaseServer
    .from("addresses")
    .select("id,country_name,city_name")
    .eq("full_address", data.fullAddress)
    .eq("index", data.index)
    .maybeSingle();

  //если нашли - возвращаем id и отрезаем продолжение функции
  if (existing) {
    return {
      id: existing.id,
      country_name: existing.country_name,
      city_name: existing.city_name
    }
  }

  // создаём запись в таблице
  const { data: created, error } = await supabaseServer
    .from("addresses")
    .insert({
      full_address: data.fullAddress,
      country_name: data.countryName,
      country_zone: data.countryZone,
      country_id: data.countryId,
      city_name: data.cityName,
      city_zone: data.cityZone,
      city_id_rf: data.cityIdRF,
      city_id_foreign: data.cityIdForeign,
      city_zone_id: data.cityZoneId,
      index: data.index
    })
    .select("id,country_name,city_name")
    .single();

  //если ошибка - кидаем её выше
  if (error) throw error;

  //возвращаем id созданного адреса или найденного
  return {
    id: created.id,
    country_name: created.country_name,
    city_name: created.city_name
  }
};