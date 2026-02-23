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
    client,
    // recipientAddressId2,
    // recipientCountry_name2,
    // recipientCity_name2,
    organizerId,
    organizerName,
    phoneOrganizer,
    emailOrganizer,
    organizerType_acc,
    organizerName_OOO,
    organizerFio_gd_OOO,
    organizerFio_IP,
    costOfCargo,
    descriptionOfCargo
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

  //создание результирующего объекта
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
    organizerName,
    organizerId,
    phoneOrganizer,
    emailOrganizer,
    organizerType_acc,
    organizerName_OOO,
    organizerFio_gd_OOO,
    organizerFio_IP,
    // recipientAddressId2,
    // recipientCountry_name2,
    // recipientCity_name2,
    sender_country_name: senderCountry_name,
    recipient_country_name: recipientCountry_name,
    sender_city_name: senderCity_name,
    recipient_city_name: recipientCity_name,
    client,
    product: propsProduct(),
    costOfCargo,
    descriptionOfCargo
  }
  return {
    orderData
  }
}