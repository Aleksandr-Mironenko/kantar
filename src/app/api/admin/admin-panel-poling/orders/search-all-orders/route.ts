import supabaseServer from '../../../../lib/supabase/server-secret';

// get  
export async function GET(request: Request): Promise<Response> {

  try {
    //ищу данные всей таблицы

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(100, Number(searchParams.get('limit') ?? 10));
    const offset = (page - 1) * limit;

    const from = offset;
    const to = offset + limit - 1;


    const { data: arrayOrderObjData, error, count } = await supabaseServer
      .from("orders")
      .select(" id, order_number, created_at,sender_id,recipient_id,price_full,address_from_id,address_where_id,name_from,name_where,phone_from,phone_where,email_from,email_where,is_paid,heft_full,status,agree,discount_this_send,is_individual", { count: 'exact' })
      .order('order_number', { ascending: false })
      // .order('created_at', { ascending: false })
      .range(from, to);
    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    const totalPages = Math.ceil((count ?? 0) / limit);


    return new Response(
      JSON.stringify({
        ok: true,
        arrayOrderObjData,
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
      JSON.stringify({ ok: false, error: 'Server error search orders' }),
      { status: 500 }
    );
  }
}

