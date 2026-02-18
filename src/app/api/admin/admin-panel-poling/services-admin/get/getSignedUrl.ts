import supabaseServer from '../../../../lib/supabase/server-secret';

export async function getSignedUrl(path: string, expires = 60 * 60) {
  if (!path) return null;

  // убедимся, что path — относительный путь
  const bucketPath = path.replace(/^https?:\/\/.+\/service_files\//, '');

  const { data, error } = await supabaseServer
    .storage
    .from("service_files")
    .createSignedUrl(bucketPath, expires);

  if (error) {
    console.error("Error creating signed URL:", error.message, "path:", bucketPath);
    return null;
  }

  return data.signedUrl;
}