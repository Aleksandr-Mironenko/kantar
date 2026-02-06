"use server";

import { DataFabricForOrder } from "../../../../components/DTO/DTO";
import { Product } from '@/app/components/DTO/DTO'

export default async function fabricForOrder(data: DataFabricForOrder) {


  //деструктуризация для общего доступа
  const { nds,
    dataprops,
    senderId,
    recipientId,
    senderAddressId,
    recipientAddressId,
    discount,
    status,
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
    isSender

  } = data

  const { nameFrom, nameWhere, phoneFrom, phoneWhere, emailFrom, emailWhere, price, isFinalHeft, isFinalOnlyHeft, isFinalOnlyVolume, agree } = dataprops

  const propsProduct = (): Product => {
    const arr = []
    if (price === 0) {
      arr.push("individual")
    } else { arr.push("express") }
    if (recipientCountry_name === "Россия" && senderCountry_name === "Россия") {
      arr.push("RF")
    } else {
      arr.push("international")
    }
    return arr.join("-") as Product

  }

  //константа только для валидации
  const orderData = {
    nds,
    senderId,
    recipientId,
    senderAddressId,
    recipientAddressId,
    nameFrom,
    nameWhere,
    phoneFrom,
    phoneWhere,
    emailFrom,
    emailWhere,
    discount,
    price,
    isPaid: false,
    isFinalHeft: Math.ceil(isFinalHeft * 100) / 100,//проверить на округление
    isFinalOnlyHeft: Math.ceil(isFinalOnlyHeft * 100) / 100,//проверить на округление
    isFinalOnlyVolume: Math.ceil(isFinalOnlyVolume * 100) / 100,//проверить на округление
    status,
    agree,
    isIndividual: price === 0,
    document,
    loadingDate: null,
    unloadingDate: null,
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
    sender_country_name: isSender ? senderCountry_name : recipientCountry_name,
    recipient_country_name: isSender ? recipientCountry_name : senderCountry_name,
    sender_city_name: isSender ? senderCity_name : recipientCity_name,
    recipient_city_name: isSender ? recipientCity_name : senderCity_name,
    isSender,
    product: propsProduct()
  }
  return {
    orderData
  }
}