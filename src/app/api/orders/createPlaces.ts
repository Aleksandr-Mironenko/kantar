import supabaseServer from './lib/supabase/server'
import { DataCreatePlases } from '@/app/components/DTO/DTO'

export async function createPlaces({ orderId, data }: DataCreatePlases) {
  const records = [];
  //перебираем все места и создаём записи в массиве с соответствующими именами таблицы

  for (const place of data) {
    for (let i = 0; i < place.places; i++) {
      records.push({
        order_id: orderId,
        length: place.length,
        width: place.width,
        height: place.height,
        heft: place.heft,
        places_personal_id: `${i + 1}_из_${place.places}_в_orderId_${orderId}`,
        price: place.price,
        volume: place.volume,
      });
    }
  }

  //передаем массив записей в одну вставку
  const { error } = await supabaseServer
    .from("order_places")
    .upsert(records, {
      onConflict: "order_places_personal_id_unique", // уникальный ключ
    });
  //если ошибка - кидаем её выше
  if (error) throw error;

  return true;
}