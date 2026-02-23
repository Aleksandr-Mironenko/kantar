import { validate } from "./validate";
import { getOrCreateUser } from "./getOrCreateUser";
import { getOrCreateAddress } from "./getOrCreateAddress";
import { createPlaces } from "./createPlaces";
import { uploadFiles } from "./uploadFiles";
import { createOrder } from "./createOrder";
import { DataCreateOrderProcess, orderIdForDataUploadFiles, } from '../../components/DTO/DTO'
import fabric from "./lib/format/fabric";
import fabricForOrder from "./lib/format/fabricForOrder";
import retry from "./lib/function/retry";


export default async function createOrderProcess(data: DataCreateOrderProcess) {
  // формирую все необходимые данные из входящего объекта
  const { places,
    fileArray,
    validateData,
    orderAdressFrom,
    orderAdressWhere,
    orderAdressOrganizer,
    getOrCreateUserFromData,
    getOrCreateUserORGData,
    getOrCreateUserWhereData,
    isInternal,
    nds,
    document,
    client,
    phoneOrganizer,
    emailOrganizer,
    costOfCargo,
    descriptionOfCargo
  } = await fabric(data)

  // валидация входящих данных
  validate(validateData);


  // проверяю адрес на наличие в бд, добавляю если нет и получаю id адресов

  const { id: senderAddressId, country_name: senderCountry_name, city_name: senderCity_name }
    = await getOrCreateAddress(orderAdressFrom);

  const { id: recipientAddressId, country_name: recipientCountry_name, city_name: recipientCity_name }
    = await getOrCreateAddress(orderAdressWhere);

  const { id: organizerAddressId, country_name: organizerCountry_name, city_name: organizerCity_name }
    = await getOrCreateAddress(orderAdressOrganizer);



  // проверяю отправителя на наличие в бд, добавляю если нет и получаю id пользователя
  const { id: senderId, name: senderName, type_acc: senderType_acc, name_OOO: senderName_OOO, fio_gd_OOO: senderFio_gd_OOO, fio_IP: senderFio_IP }
    = await getOrCreateUser(getOrCreateUserFromData);

  // проверяю получателя на наличие в бд, добавляю если нет и получаю id пользователя
  const { id: recipientId, name: recipientName, type_acc: recipientType_acc, name_OOO: recipientName_OOO, fio_gd_OOO: recipientFio_gd_OOO, fio_IP: recipientFio_IP }
    = await getOrCreateUser(getOrCreateUserWhereData);

  // проверяю организатора на наличие в бд, добавляю если нет и получаю id пользователя
  const { id: organizerId, name: organizerName, type_acc: organizerType_acc, name_OOO: organizerName_OOO, fio_gd_OOO: organizerFio_gd_OOO, fio_IP: organizerFio_IP
  }
    = await getOrCreateUser(getOrCreateUserORGData)


  // формирую данные для создания заказа
  const { orderData } = await fabricForOrder({
    costOfCargo,
    descriptionOfCargo,
    nds,
    dataprops: data,
    senderId,
    recipientId,
    senderAddressId,
    recipientAddressId,
    discount: 0,
    status: "new" as const,
    document,
    senderName,
    senderType_acc,
    senderName_OOO,
    senderFio_gd_OOO,
    senderFio_IP,
    recipientName,
    recipientType_acc,
    recipientName_OOO,
    recipientFio_gd_OOO,
    recipientFio_IP,
    senderCountry_name,
    recipientCountry_name,
    senderCity_name,
    recipientCity_name,
    client,
    // recipientAddressId2,
    // recipientCountry_name2,
    // recipientCity_name2,

    organizerId: String(organizerId),
    organizerName,
    phoneOrganizer,
    emailOrganizer,
    organizerType_acc,
    organizerName_OOO,
    organizerFio_gd_OOO,
    organizerFio_IP,
  }
  )

  //создаю заказ и получаю его id и номер заказа
  let orderId: orderIdForDataUploadFiles = []
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