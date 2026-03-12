import findOrder from "./findOrder"
import findPlace from "./findPlace"
import findFilesInOrder from "./findFilesInOrder"
import findUser from "./findUser"
import findAddress from "./findAddress"
import findFilesInUser from "./findFilesInUser"

export async function POST(req: Request) {
  const { numberOrder } = await req.json();


  try {

    //ищу данные заказа из таблицы 
    const dataOrder = await findOrder(numberOrder)
    if (!dataOrder) {
      return new Response(
        JSON.stringify({ ok: false }),
        { status: 403 }
      )
    }

    //ищу детали мест по номеру заказам
    const arrayPlacesInOrder = await findPlace(numberOrder)
    console.log(arrayPlacesInOrder)
    //получение файлов из конкретного заказа
    const arrrfiles = await findFilesInOrder(numberOrder)
    console.log(arrrfiles)

    //получние данных отправителя
    const dataUserSendler = await findUser(dataOrder.sender_id)
    console.log(dataUserSendler)

    //получение файлов отправителя
    const filesSendler = await findFilesInUser(dataOrder.sender_id)
    console.log(filesSendler)

    //получние данных получателя
    const dataUserRecipient = await findUser(dataOrder.recipient_id)
    console.log(dataUserRecipient)
    //получение файлов получателе
    const filesRecipient = await findFilesInUser(dataOrder.recipient_id)
    console.log(filesRecipient)

    //получние данных об организаторе
    const dataUserOrganizer = await findUser(dataOrder.address_organizer_id)

    //получение файлов организаторе
    const filesOrganizer = await findFilesInUser(dataOrder.address_organizer_id)


    //получние данных адреса отправителя
    const dataAddressSendler = await findAddress(dataOrder.address_from_id)
    console.log(dataAddressSendler)
    //получние данных адреса получателя
    const dataAddressRecipient = await findAddress(dataOrder.address_where_id)
    console.log(dataAddressRecipient)
    // Возвращаем нужные поля
    return new Response(
      JSON.stringify({
        ok: true,
        dataOrder,
        arrayPlacesInOrder,
        arrrfiles,
        dataUserOrganizer,
        dataUserSendler,
        dataUserRecipient,
        dataAddressSendler,
        dataAddressRecipient,
        filesOrganizer,
        filesSendler,
        filesRecipient
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
