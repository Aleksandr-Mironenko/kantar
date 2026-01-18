import supabaseServer from '../../../../lib/supabase/server-secret';

// get  
export async function POST(req: Request) {
  const { numberOrder } = await req.json();
  try {

    //ищу данные заказа из таблицы
    const { data: dataOrder, error: error0 } = await supabaseServer
      .from("orders")
      .select(" id, order_number, created_at,sender_id,recipient_id,price_full,address_from_id,address_where_id,name_from,name_where,phone_from,phone_where,email_from,email_where,is_paid,heft_full,status,agree,discount_this_send,is_individual")
      .eq("order_number", numberOrder)
      .single();

    if (error0) { throw new Error("order not found") }
    if (!dataOrder) throw new Error("places not found")
    //я получил все значения конкретного заказа
    // dataOrder   - это объект!

    //ищу детали мест по номеру заказам
    const { data: arrayPlacesInOrder, error: error1 } = await supabaseServer
      .from("order_places")
      .select("id, order_number, order_id,length,width,height,heft,fullPrice,price,nds,volume,places_personal_id,status_place,sumPlaces")
      .eq("order_number", numberOrder)



    if (error1) throw new Error("places not found");
    if (!arrayPlacesInOrder.length) throw new Error("places not found")
    //я получил МАССИВ всеx мест со значениями конкретного заказа
    //arrayPlacesInOrder   - это массив!

    //создание массива для заполнения при наличии файлов




    //получение файлов из конкретного заказа
    const { data: arrayFilesInOrder, error: error2 } = await supabaseServer
      .from("order_files")
      .select("bucket_path, file_personal_id")
      .eq("order_number", Number(numberOrder))

    //создание массива для заполнения при наличии файлов
    const arrrfiles: string[] = []

    if (!error2 && Array.isArray(arrayFilesInOrder) && arrayFilesInOrder.length) {

      //я получил массив строк ссылок на файлы


      for (const hash of arrayFilesInOrder) {

        // const cleanPath = hash.bucket_path.replace(/^order-files\//, "")

        const { data: file, error: error3 } = await supabaseServer
          .storage
          .from('order-files')
          .createSignedUrl(hash.bucket_path, 60 * 15)

        if (error3) throw new Error("file signed url error");
        if (!file?.signedUrl) throw new Error("file not found");

        //заполнение массива файлов
        arrrfiles.push(file.signedUrl);
      }


    }

    //получние данных об отправителе
    const { data: dataUserSendler, error: error4 } = await supabaseServer
      .from("users")
      .select("id, email, phone,name,address_id,is_client,is_dogovor,type_acc,ref_code,created_at,discount,address_id")
      .eq("id", dataOrder.sender_id)
      .single();
    if (error4) throw new Error(`users sendler error ${JSON.stringify(error4)}`);
    if (!dataUserSendler) throw new Error("users sendler not found");


    //получние данных о получателе
    const { data: dataUserRecipient, error: error5 } = await supabaseServer
      .from("users")
      .select("id, email, phone,name,address_id,is_client,is_dogovor,type_acc,ref_code,created_at,discount,address_id")
      .eq("id", dataOrder.recipient_id)
      .single();
    if (error5) throw new Error(`users recipient error  ${JSON.stringify(error5)}`);
    if (!dataUserRecipient) throw new Error("users recipient not found");


    //получние данных об адресе отправителя
    const { data: dataAddressSendler, error: error6 } = await supabaseServer
      .from("addresses")
      .select("id, full_address, country_name,country_zone,country_id,city_name,city_zone,city_id_rf,city_id_foreign,city_zone_id,index")
      .eq("id", dataOrder.address_from_id)
      .single();
    if (error6) throw new Error(`addresses from error  ${JSON.stringify(error6)}`);
    if (!dataAddressSendler) throw new Error("addresses from not found");


    //получние данных об адресе получателя
    const { data: dataAddressRecipient, error: error7 } = await supabaseServer
      .from("addresses")
      .select("id, full_address, country_name,country_zone,country_id,city_name,city_zone,city_id_rf,city_id_foreign,city_zone_id,index")
      .eq("id", dataOrder.address_where_id)
      .single();
    if (error7) throw new Error(`addresses where url error  ${JSON.stringify(error7)}`);
    if (!dataAddressRecipient) throw new Error("addresses where not found");


    //получние данных об адресе получателя по id отправителя
    const { data: dataAddressInIdSendler, error: error8 } = await supabaseServer
      .from("addresses")
      .select("id, full_address, country_name,country_zone,country_id,city_name,city_zone,city_id_rf,city_id_foreign,city_zone_id,index")
      .eq("id", dataOrder.address_where_id)
      .single();
    if (error8) throw new Error(`addresses where url error  ${JSON.stringify(error7)}`);
    if (!dataAddressInIdSendler) throw new Error("addresses where not found");


    //получние данных об адресе получателя по id получателя
    const { data: dataAddressInIRecipient, error: error9 } = await supabaseServer
      .from("addresses")
      .select("id, full_address, country_name,country_zone,country_id,city_name,city_zone,city_id_rf,city_id_foreign,city_zone_id,index")
      .eq("id", dataOrder.address_where_id)
      .single();
    if (error9) throw new Error(`addresses where url error  ${JSON.stringify(error7)}`);
    if (!dataAddressInIRecipient) throw new Error("addresses where not found");



    // // Возвращаем нужные поля
    return new Response(
      JSON.stringify({
        ok: true,
        dataOrder,
        arrayPlacesInOrder,
        arrrfiles,
        dataUserSendler,
        dataUserRecipient,
        dataAddressSendler,
        dataAddressRecipient,
        dataAddressInIdSendler,
        dataAddressInIRecipient
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
