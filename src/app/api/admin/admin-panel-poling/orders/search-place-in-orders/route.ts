import supabaseServer from '../../../../lib/supabase/server-secret';

// POST /api/admin/login
export async function POST(req: Request) {
  const { props } = await req.json();

  try {

    const { data: arrayPlacesInOrder, error: error1 } = await supabaseServer
      .from("order_places")
      .select("id, order_number, order_id,length,width,height,heft,fullPrice,price,nds,volume,places_personal_id")
      .eq("order_number", props)



    if (error1) throw new Error("places not found");
    if (!arrayPlacesInOrder.length) throw new Error("places not found")

    const { data: arrayFilesInOrder, error: error2 } = await supabaseServer
      .from("order_files")
      .select("bucket_path, file_personal_id")
      .eq("order_number", Number(props))

    const arrrfiles: string[] = []

    if (!error2 && Array.isArray(arrayFilesInOrder) && arrayFilesInOrder.length) {

      for (const hash of arrayFilesInOrder) {

        // const cleanPath = hash.bucket_path.replace(/^order-files\//, "")

        const { data: file, error: error3 } = await supabaseServer
          .storage
          .from('order-files')
          .createSignedUrl(hash.bucket_path, 60 * 15)

        if (error3) throw new Error("file signed url error");
        if (!file?.signedUrl) throw new Error("file not found");

        arrrfiles.push(file.signedUrl);
      }

    }




    // // Возвращаем нужные поля
    return new Response(
      JSON.stringify({
        ok: true,
        arrayPlacesInOrder,
        arrrfiles
      })

    )
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Server error search arrayPlacesInOrders' }),
      { status: 500 }
    );
  }
}
