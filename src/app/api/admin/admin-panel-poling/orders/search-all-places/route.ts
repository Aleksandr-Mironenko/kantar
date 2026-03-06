import supabaseServer from '../../../../lib/supabase/server-public';

// get  
export async function GET(request: Request): Promise<Response> {
  const supabaseServers = supabaseServer();
  try {
    //ищу данные всей таблицы
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(100, Number(searchParams.get('limit') ?? 10));
    const offset = (page - 1) * limit;

    const from = offset;
    const to = offset + limit - 1;


    const { data: arrayPlacesObjData, error, count } = await supabaseServers
      .from("order_places")
      .select("id, order_number, order_id,length,width,height,heft,fullPrice,price,nds,volume,places_personal_id", { count: 'exact' })
      .range(from, to);

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    const totalPages = Math.ceil((count ?? 0) / limit);

    return new Response(
      JSON.stringify({
        ok: true,
        arrayPlacesObjData,
        meta: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }),
      { status: 200 }

    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ ok: false, error: 'Server error search arrayPlacesObjData' }),
      { status: 500 }
    );
  }
}