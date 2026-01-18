import supabaseServer from '../../../../lib/supabase/server-secret';

// get  
export async function GET() {
  try {
    //ищу данные всей таблицы

    const { data: arrayOrderObjData, error } = await supabaseServer
      .from("orders")
      .select(" id, order_number, created_at,sender_id,recipient_id,price_full,address_from_id,address_where_id,name_from,name_where,phone_from,phone_where,email_from,email_where,is_paid,heft_full,status,agree,discount_this_send,is_individual");

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        arrayOrderObjData,
      })

    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ ok: false, error: 'Server error search orders' }),
      { status: 500 }
    );
  }
}