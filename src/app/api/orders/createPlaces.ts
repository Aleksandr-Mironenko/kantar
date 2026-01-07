import supabaseServer from '@/app/api/lib/supabase/server-secret';
import { DataCreatePlases } from '@/app/components/DTO/DTO'

export async function createPlaces({ orderId, data, isInternal, nds }: DataCreatePlases) {
  const records = [];
  //перебираем все места и создаём записи в массиве с соответствующими именами таблицы

  for (const place of data) {
    for (let i = 0; i < place.places; i++) {
      records.push({
        order_id: orderId[0],
        order_number: orderId[1],
        length: place.length,
        width: place.width,
        height: place.height,
        heft: place.heft,
        places_personal_id: `${i + 1}_из_${place.places}_в_order_number_${orderId[1]}`,
        price: Math.ceil(place.price),
        nds: isInternal ? Math.ceil(place.price * (nds - 1)) : 0,
        fullPrice: isInternal ? Math.ceil(place.price * nds) : Math.ceil(place.price),
        volume: place.volume,
      });
    }
  }

  //передаем массив записей в одну вставку
  const { error } = await supabaseServer
    .from("order_places")
    .upsert(records, {
      onConflict: "order_id,places_personal_id", // уникальный ключ
    });
  //если ошибка - кидаем её выше
  if (error) throw error;

  return true;
}