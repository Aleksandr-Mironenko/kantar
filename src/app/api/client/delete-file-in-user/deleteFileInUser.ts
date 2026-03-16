import supabaseServer from '@/app/api/lib/supabase/server-public'


// удаление файла по file_personal_id
export default async function deleteFileInOrder(fileId: number) {
  const supabaseServers = supabaseServer();

  // 1. Получаем путь файла
  const { data: fileData, error: error1 } = await supabaseServers
    .from("user_files")
    .select("bucket_path")
    .eq("file_personal_id", fileId)
    .single();

  if (error1) throw new Error("file not found");

  // 2. Удаляем файл из storage
  const { error: error2 } = await supabaseServers
    .storage
    .from("user_files")
    .remove([fileData.bucket_path]);

  if (error2) throw new Error("file delete error");

  // 3. Удаляем запись из базы
  const { error: error3 } = await supabaseServers
    .from("user_files")
    .delete()
    .eq("file_personal_id", fileId);

  if (error3) throw new Error("db delete error");

  return true;
}