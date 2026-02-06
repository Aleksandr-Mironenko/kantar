import supabaseServer from '@/app/api/lib/supabase/server-secret';
import { DataUploadUserFiles } from '../../components/DTO/DTO'
import retry from "@/app/api/orders/lib/function/retry";


export default async function uploadFiles({ userId, files, name = "" }: DataUploadUserFiles) {
  let num = 1
  for (const file of files) {
    function sanitizeFileName(name: string) {
      return name
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "_");
    }
    const path = `${userId}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;

    // загружаем файл с retry
    await retry(async () => {
      const { error: uploadError } = await supabaseServer.storage
        .from("user_files")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      // сохраняю информацию о файле в таблице  
      const { error: insertError } = await supabaseServer.from("user_files").upsert({
        user_id: userId,
        user_number: userId,
        file_personal_id: `${name === "" ? "" : `${name}_`}${file.name}_${num}_в_user_number_${userId}_${crypto.randomUUID()}`,
        bucket_path: path,
        filename: file.name
      },
        { onConflict: "user_id, file_personal_id" },// уникальный ключ
      );

      if (insertError) throw insertError;
      return true;
    }, { retries: 5, delay: 50 });
    num++
  }
  return true;
}