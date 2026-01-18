import { NextResponse } from "next/server";
import { sendEmail } from "../lib/helpers/sendEmail"
import { sendSMS } from "../lib/helpers/sendSms";
import createOrderProcess from '../orders/createOrderProcess'
import fabric from "./lib/fabric";

export async function POST(req: Request) {
  const formData = await req.formData();


  const {
    agree, client, phoneFrom, phoneWhere, emailFrom, emailWhere, fileArray, sms, emailMessage, isFinalHeft, price, nds, count,
    fromCountryObj, whereCountryObj, fromCityObj, whereCityObj, showInvois, nameFrom, nameWhere,
    adressFrom, adressWhere, document, from, where, indexFrom, indexWhere, places, fs, fsRF, koefficient, descriptionOfCargo

  } = await fabric(formData)

  const tasks: Promise<unknown>[] = []
  let orderNumbers
  if (agree) {

    //создание заказа в бд
    orderNumbers = await createOrderProcess({
      agree, client, phoneFrom, phoneWhere, emailFrom, emailWhere, fileArray, isFinalHeft, price, nds, count, fromCountryObj, whereCountryObj, fromCityObj, whereCityObj, showInvois, nameFrom, nameWhere,
      adressFrom, adressWhere, document, from, where, indexFrom, indexWhere, places, fs, fsRF, koefficient, descriptionOfCargo
    })

  }
  const response = NextResponse.json({ success: true, orderNumbers })
  tasks.push(

    //отправка сообщения администратору Кирилл (ТУТ МЕСТО РОСТА - БРАТЬ ДАННЫЕ С БЛОКА АДМИНОВ КОТОРЫЕ РАБОТАЮТ)
    sendEmail(
      "udink7405@gmail.com",
      `Новый заказ ${orderNumbers && JSON.stringify(orderNumbers?.orderId)}`,
      emailMessage.bodyTextMessage,
      `НОВЫЙ ЗАКАЗ ${orderNumbers && JSON.stringify(JSON.stringify(orderNumbers?.orderId))} KANTAR`,
      fileArray
    ),

    //отправка сообщения администратору (ТУТ МЕСТО РОСТА - БРАТЬ ДАННЫЕ С БЛОКА АДМИНОВ КОТОРЫЕ РАБОТАЮТ)
    sendEmail(
      "sanek.miron2@gmail.com",
      `Новый заказ ${orderNumbers && JSON.stringify(orderNumbers?.orderId)}`,
      emailMessage.bodyTextMessage,
      `НОВЫЙ ЗАКАЗ ${orderNumbers && JSON.stringify(JSON.stringify(orderNumbers?.orderId))} KANTAR`,

      fileArray
    ),

    //отправка сообщения создателю заявки
    sendEmail(
      client === "sender" ? emailFrom : emailWhere,
      "Вы создали заявку на отправление груза KANTAR",
      `${orderNumbers && `<p style="font-size:20px">Номер вашего заказа: ${JSON.stringify(JSON.stringify(orderNumbers?.orderId))}</p>`}
        ${emailMessage.bodyTextMessageUser}`
      ,
      "KANTAR"
    ),

    //отправка админу Кириллу (ТУТ МЕСТО РОСТА - БРАТЬ ДАННЫЕ С БЛОКА АДМИНОВ КОТОРЫЕ РАБОТАЮТ)
    sendSMS("+79991386191",
      `${orderNumbers && `Номер заказа: ${JSON.stringify(orderNumbers?.orderId)}`}
        ${sms.messageAdminSMS} `),

    //отправка админу (ТУТ МЕСТО РОСТА - БРАТЬ ДАННЫЕ С БЛОКА АДМИНОВ КОТОРЫЕ РАБОТАЮТ)
    sendSMS("+79030404804",
      `${orderNumbers && `Номер заказа: ${JSON.stringify(orderNumbers?.orderId)}`}
      ${sms.messageAdminSMS}`),

    //отправка клиенту
    sendSMS(`${client === "sender" ? phoneFrom : phoneWhere} `,
      `${orderNumbers && `Номер вашего заказа: ${JSON.stringify(orderNumbers?.orderId)}`}
        ${sms.messageUserSMS} `),
  )

  //отправка сообщения второй стороне
  if (emailWhere !== emailFrom) {
    // if (client === "sender" ? emailWhere : emailFrom) {
    if (client !== "sender") {
      tasks.push(sendEmail(
        // client === "sender" ? emailWhere : emailFrom,
        emailFrom,
        // client === "sender" ? "Вы указаны получателем" : "Вы указаны отправителем",
        "Вы указаны отправителем",
        `${orderNumbers && `<p>Номер заказа: ${JSON.stringify(JSON.stringify(orderNumbers?.orderId))}</p>`}
        ${emailMessage.bodyTextMessageUser2}`
        ,
        "KANTAR"
      ));
    }
  }

  const results = await Promise.allSettled(tasks)

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.log("Ошибка в send-calculate/route:", index, result.reason)
    }
  })

  return response;
}
