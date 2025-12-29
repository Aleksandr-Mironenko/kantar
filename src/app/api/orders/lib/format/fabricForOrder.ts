"use server";

import { DataCreateOrderProcess } from "@/app/components/DTO/DTO";

type DataFabricForOrder = {
  dataprops: DataCreateOrderProcess,
  senderId: number,
  recipientId: number,
  senderAddressId: number,
  recipientAddressId: number,
  discount: number,
  status: "new order" | // новый заказ 
  "pickup required (processed)" | // требуется забор (обработано)
  "awaiting payment (shipped)" | // ожидает оплаты(отправлен)
  "awaiting payment (not shipped)" | // ожидает оплаты(не отправлен)
  "in transit" | // в пути
  "delivery pending" | // согласовывается вручение
  "in transit (delivery)" | // в пути (вручение)
  "delivered", // вручено 
}

export default async function fabricForOrder(data: DataFabricForOrder) {


  //деструктуризация для общего доступа
  const { dataprops,
    senderId,
    recipientId,
    senderAddressId,
    recipientAddressId,
    discount,
    status } = data

  const { nameFrom, nameWhere, phoneFrom, phoneWhere, emailFrom, emailWhere, price, isFinalHeft, agree } = dataprops

  //константа только для валидации
  const orderData = {
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
    agree
  }


  return {
    orderData
  }
}