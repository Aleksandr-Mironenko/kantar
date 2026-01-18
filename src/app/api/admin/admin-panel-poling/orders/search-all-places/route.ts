import supabaseServer from '../../../../lib/supabase/server-public';

// get  
export async function get() {
  try {
    //ищу данные всей таблицы

    const { data: arrayPlacesObjData, error } = await supabaseServer
      .from("order_places")
      .select("id, order_number, order_id,length,width,height,heft,fullPrice,price,nds,volume,places_personal_id");

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        arrayPlacesObjData,
      })

    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ ok: false, error: 'Server error search arrayPlacesObjData' }),
      { status: 500 }
    );
  }
}