import supabaseServer from '../../../lib/supabase/server-public';

//получение файлов по номеру заказа
export default async function findFilesInOrder(numberOrder: number) {
  const supabaseServers = supabaseServer();
  const { data: arrayFilesInOrder, error: error2 } = await supabaseServers
    .from("order_files")
    .select("bucket_path, file_personal_id")
    .eq("order_number", Number(numberOrder))

  //создание массива для заполнения при наличии файлов
  const arrrfiles: string[] = []

  if (!error2 && Array.isArray(arrayFilesInOrder) && arrayFilesInOrder.length) {

    for (const hash of arrayFilesInOrder) {

      const { data: file, error: error3 } = await supabaseServers
        .storage
        .from('order-files')
        .createSignedUrl(hash.bucket_path, 60 * 15)

      if (error3) throw new Error("file signed url error");
      if (!file?.signedUrl) throw new Error("file not found");

      //заполнение массива файлов
      arrrfiles.push(file.signedUrl);
    }
  }

  return arrrfiles
}