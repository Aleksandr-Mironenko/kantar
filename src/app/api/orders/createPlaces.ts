// import supabaseServer from '../lib/supabase/server-secret';
// import { DataCreatePlases } from '../../components/DTO/DTO'

// export async function createPlaces({ orderId, data, isInternal, nds }: DataCreatePlases) {
//   const records = [];
//   //перебираем все места и создаём записи в массиве с соответствующими именами таблицы

//   for (let placeIndex = 0; placeIndex < data.length; placeIndex++) {
//     const place = data[placeIndex];

//     for (let i = 0; i < place.places; i++) {
//       records.push({
//         order_id: orderId[0],
//         order_number: orderId[1],
//         length: place.length,
//         width: place.width,
//         height: place.height,
//         heft: place.heft,
//         places_personal_id: `${placeIndex + 1}_${i + 1}_из_${place.places}_№_${orderId[1]}`,
//         price: Math.ceil(place.price),
//         nds: isInternal ? Math.ceil(place.price * (nds - 1)) : 0,
//         fullPrice: isInternal ? Math.ceil(place.price * nds) : Math.ceil(place.price),
//         volume: place.volume,
//         status_place: "client_responsibility",// "confirmed" | "changes_have_been_made"| |"canceled",
//         sumPlaces: place.places,
//       });
//     }
//   }

//   //передаем массив записей в одну вставку
//   const { error } = await supabaseServer
//     .from("order_places")
//     .upsert(records, {
//       onConflict: "order_id,places_personal_id", // уникальный ключ
//     });
//   //если ошибка - кидаем её выше
//   if (error) throw error;

//   return true;
// }


import supabaseServer from '../lib/supabase/server-secret';
import { DataCreatePlases } from '../../components/DTO/DTO'

export async function createPlaces({ orderId, data, isInternal, nds }: DataCreatePlases) {
  const records = [];
  //перебираем все места и создаём записи в массиве с соответствующими именами таблицы

  let counter = 0;
  const totalPlaces = data.reduce((sum, p) => sum + p.places, 0);

  for (let placeIndex = 0; placeIndex < data.length; placeIndex++) {
    const place = data[placeIndex];

    for (let i = 0; i < place.places; i++) {
      counter++;
      records.push({
        order_id: orderId[0],
        order_number: orderId[1],
        length: place.length,
        width: place.width,
        height: place.height,
        heft: place.heft,
        places_personal_id: `${counter}_из_${totalPlaces}___№_${orderId[1]}`,
        price: Math.ceil(place.price),
        nds: isInternal ? Math.ceil(place.price * (nds - 1)) : 0,
        fullPrice: isInternal ? Math.ceil(place.price * nds) : Math.ceil(place.price),
        volume: place.volume,
        status_place: "client_responsibility",// "confirmed" | "changes_have_been_made"| |"canceled",
        sumPlaces: place.places,
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

