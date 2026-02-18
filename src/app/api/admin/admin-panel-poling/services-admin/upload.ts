import supabaseServer from '@/app/api/lib/supabase/server-secret'
import retry from '@/app/api/orders/lib/function/retry'


export async function uploadFilesService({
  file,
  serviceUrlname
}: {
  file: File | null
  serviceUrlname: string
}) {

  if (!file) {
    throw new Error("Файл не передан")
  }

  function sanitizeFileName(name: string) {
    return name
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "_")
  }

  const path = `${serviceUrlname}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`

  // загрузка с retry
  await retry(async () => {
    const { error } = await supabaseServer.storage
      .from("service_files")
      .upload(path, file, { upsert: true })

    if (error) throw error

    return true
  }, { retries: 5, delay: 50 })

  // получаем публичную ссылку
  const { data } = supabaseServer.storage
    .from("service_files")
    .getPublicUrl(path)

  if (!data?.publicUrl) {
    throw new Error("Не удалось получить ссылку на файл")
  }

  return data.publicUrl
}