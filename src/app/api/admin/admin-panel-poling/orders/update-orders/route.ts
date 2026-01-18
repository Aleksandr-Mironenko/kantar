import supabaseServer from '../../../../lib/supabase/server-secret';


export async function PATCH(req: Request) {
  const { id, field, value } = await req.json();


  // const correctHeft = (heft: number) => {
  //   if (heft % 0.5 !== 0) {
  //     const clog = 5 - (heft % 0.5)
  //     return heft + clog
  //   }
  //   return heft
  // }

  try {

    //смена стоимости в случае изменения поля скидки
    if (field === "discount_this_send") {
      const { data, error } = await supabaseServer
        .from("orders")
        .select("price_full,discount_this_send,order_number")
        .eq("id", id)
        .single()

      if (error || !data) throw new Error("Order not found");

      const { price_full, discount_this_send, order_number } = data

      console.log(order_number, "для замены в places")

      const procent = Number(price_full) / (100 - Number(discount_this_send))
      await supabaseServer
        .from("orders")
        .update({ ["price_full"]: Math.round(procent * (100 - Number(value))) })

        //добавить изменение в стоимости places 
        .eq("id", id);
    }

    // if (field === "heft_full") {  // Надо ли нам в таблице видеть вес кратный 0.5 или реальный
    //   const newHeft = correctHeft(value)
    //   await supabaseServer
    //     .from("orders")
    //     .update({ [field]: (newHeft) })
    //     .eq("id", id);
    // } else {
    await supabaseServer
      .from("orders")
      .update({ [field]: (value) })
      .eq("id", id);
    // }



    // Возвращаем нужные поля
    return new Response(
      JSON.stringify({
        ok: true
      })

    )
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false, error: `Server error not update order id: ${id}` }),
      { status: 500 }
    );
  }
}

