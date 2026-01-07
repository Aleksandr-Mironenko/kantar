import { validate } from "./validate";
import { getOrCreateUser } from "./getOrCreateUser";
import { getOrCreateAddress } from "./getOrCreateAddress";
import { createPlaces } from "./createPlaces";
import { uploadFiles } from "./uploadFiles";
import { createOrder } from "./createOrder";
import { DataCreateOrderProcess } from '@/app/components/DTO/DTO'
import fabric from "./lib/format/fabric";
import fabricForOrder from "./lib/format/fabricForOrder";
import retry from "./lib/function/retry";


export default async function createOrderProcess(data: DataCreateOrderProcess) {
  // формирую все необходимые данные из входящего объекта
  const { places,
    fileArray,
    validateData,
    orderCreator,
    noOrderCreator,
    getOrCreateUserFromData,
    getOrCreateUserWhereData,
    isInternal,
    nds } = await fabric(data)

  // валидация входящих данных
  validate(validateData);


  // проверяю адрес на наличие в бд, добавляю если нет и получаю id адресов
  const senderAddressId = await getOrCreateAddress(orderCreator);
  const recipientAddressId = await getOrCreateAddress(noOrderCreator);


  // проверяю пользователей на наличие в бд, добавляю если нет и получаю id пользователя
  const senderId = await getOrCreateUser(getOrCreateUserFromData);

  // проверяю пользователей на наличие в бд, добавляю если нет и получаю id пользователя
  const recipientId = await getOrCreateUser(getOrCreateUserWhereData);

  // формирую данные для создания заказа
  const { orderData } = await fabricForOrder({
    dataprops: data,
    senderId,
    recipientId,
    senderAddressId,
    recipientAddressId,
    discount: 0,
    status: "new" as const
  }
  )

  //создаю заказ и получаю его id и номер заказа
  let orderId: number[] = []
  if (orderData && senderId && senderAddressId && recipientId && recipientAddressId) {
    orderId = await createOrder(orderData, isInternal, nds);
  }
  const numberOrder = orderId[1]
  const hachIdOrder = orderId[0]

  if (!numberOrder) {
    orderId = await retry(() => createOrder(orderData, isInternal, nds), { retries: 5, delay: 100 });
  }
  if (numberOrder === undefined) {
    throw new Error("Failed to create order after multiple attempts");
  } else {
    //формирую данные для создания мест
    const createPlacesData = { orderId, data: places, isInternal, nds }

    //добавляю каждое место заказа присваивая их номеру заказа
    await retry(() => createPlaces(createPlacesData), { retries: 5, delay: 100 });

    // let resultPlacess = await createPlaces(createPlacesData);
    // if (!resultPlacess) {
    //   resultPlacess = await retry(() => createPlaces(createPlacesData), { retries: 5, delay: 100 });
    //   if (!resultPlacess) {
    //     throw new Error("Failed to create places after multiple attempts");
    //   }

    //конец блока который можно заменить на комментарий

    //Формирую данные для загрузки файлов
    const uploadFilesData = { orderId, files: fileArray }

    //загружаю файлы если они есть
    if (fileArray.length > 0) {

      await retry(() => uploadFiles(uploadFilesData), { retries: 5, delay: 100 });

      // let resultPlacess = await uploadFiles(uploadFilesData);
      // if (!resultPlacess) {
      //   resultPlacess = await retry(() => uploadFiles(uploadFilesData), { retries: 5, delay: 100 });
      // }
      // if (!resultPlacess) {
      //   throw new Error("Failed to upload files after multiple attempts");
      // }

      //конец блока который можно заменить на комментарий

      // }

    }
  }
  //возвращаю только id созданного заказа
  return { orderId: numberOrder };
}