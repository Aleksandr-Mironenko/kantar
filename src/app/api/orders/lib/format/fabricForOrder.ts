"use server";

import { DataFabricForOrder } from "../../../../components/DTO/DTO";

export default async function fabricForOrder(data: DataFabricForOrder) {


  //деструктуризация для общего доступа
  const { nds,
    dataprops,
    senderId,
    recipientId,
    senderAddressId,
    recipientAddressId,
    discount,
    status } = data

  const { nameFrom, nameWhere, phoneFrom, phoneWhere, emailFrom, emailWhere, price, isFinalHeft, agree } = dataprops

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
    isFinalHeft,
    status,
    agree,
    isIndividual: price === 0
  }


  return {
    orderData
  }
}