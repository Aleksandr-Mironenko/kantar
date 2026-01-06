import supabaseServer from '@/app/api/lib/supabase/server-secret';
import { DataUploadFiles } from '@/app/components/DTO/DTO'
import retry from "./lib/function/retry";


export async function uploadFiles({ orderId, files }: DataUploadFiles) {
  let num = 1
  for (const file of files) {
    const path = `${orderId[1]}/${crypto.randomUUID()}-${file.name}`;

    // загружаем файл с retry

    await retry(async () => {
      const { error: uploadError } = await supabaseServer.storage
        .from("order-files")
        .upload(path, file);
      if (uploadError) throw uploadError;

      // сохраняю информацию о файле в таблице  
      const { error: insertError } = await supabaseServer.from("order_files").upsert({
        order_id: orderId[0],
        order_number: orderId[1],
        file_personal_id: `${file.name}_${num}_в_order_number_${orderId[1]}`,
        bucket_path: path,
        filename: file.name
      },
        { onConflict: "order_id, file_personal_id" },// уникальный ключ
      );

      if (insertError) throw insertError;
      return true;
    }, { retries: 5, delay: 50 });
    num++
  }
  return true;
}