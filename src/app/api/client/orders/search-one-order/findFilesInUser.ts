// import supabaseServer from '../../../lib/supabase/server-public';

// //получение файлов по номеру заказа
// export default async function findFilesInOrder(numberId: number) {
//   const supabaseServers = supabaseServer();
//   const { data: arrayFilesInUser, error: error8 } = await supabaseServers
//     .from("user_files")
//     .select("bucket_path, file_personal_id")
//     .eq("user_id", numberId)

//   //создание массива для заполнения при наличии файлов
//   const arrrFilesUser: string[] = []

//   if (!error8 && Array.isArray(arrayFilesInUser) && arrayFilesInUser.length) {

//     for (const hash of arrayFilesInUser) {

//       const { data: file, error: error8 } = await supabaseServers
//         .storage
//         .from('user_files')
//         .createSignedUrl(hash.bucket_path, 60 * 15)

//       if (error8) throw new Error("file signed url error");
//       if (!file?.signedUrl) throw new Error("file not found");

//       //заполнение массива файлов
//       arrrFilesUser.push(file.signedUrl);
//     }
//   }

//   return arrrFilesUser
// }




import supabaseServer from '../../../lib/supabase/server-public';

//получение файлов по номеру заказа
export default async function findFilesInOrder(numberId: number) {
  const supabaseServers = supabaseServer();
  const { data: arrayFilesInUser, error: error8 } = await supabaseServers
    .from("user_files")
    .select("bucket_path, file_personal_id, filename")
    .eq("user_id", numberId)

  //создание массива для заполнения при наличии файлов
  const arrrFilesUser: { filename: string, signedUrl: string }[] = []

  if (!error8 && Array.isArray(arrayFilesInUser) && arrayFilesInUser.length) {

    for (const hash of arrayFilesInUser) {

      const { data: file, error: error8 } = await supabaseServers
        .storage
        .from('user_files')
        .createSignedUrl(hash.bucket_path, 60 * 15)

      if (error8) throw new Error("file signed url error");
      if (!file?.signedUrl) throw new Error("file not found");

      //заполнение массива файлов
      arrrFilesUser.push({ filename: hash.filename, signedUrl: file.signedUrl });
    }
  }

  return arrrFilesUser
}