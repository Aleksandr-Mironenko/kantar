import { NextResponse } from "next/server";
import { sendEmail } from "../lib/helpers/sendEmail"
import { sendSMS } from "../lib/helpers/sendSms";
import fabric from "./lib/fabric"
import findOrCreateUser from "./findOrCreateUser"
import retry from "@/app/api/orders/lib/function/retry";
import uploadFiles from './uploadFiles'
import findUserType from "./findUserType"

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();

  //функция парсинга данных и генерации сообщений
  const {
    getOrCreateUserWhereData, agree, phone, email, fileArray, sms, emailMessage
  } = await fabric(formData)

  const tasks: Promise<unknown>[] = []

  if (agree) {

    const checkUserInTable: string = await findUserType(email)

    //защита от изменений если тип не соответствуют требованию
    if (checkUserInTable !== "not_user" &&
      checkUserInTable !== "OOO" &&
      checkUserInTable !== "IP" &&
      checkUserInTable !== "private" &&
      checkUserInTable !== "request") {

      // проверяю пользователей на наличие в бд, добавляю если нет и получаю id пользователя
      const userId = await findOrCreateUser(email, getOrCreateUserWhereData);
      //
      if (fileArray.length > 0) {

        const uploadFilesData = { userId, files: fileArray }

        await retry(() => uploadFiles(uploadFilesData), { retries: 5, delay: 100 });

      }
    }
    tasks.push(
      //отправка сообщения администратору Кирилл
      sendEmail(
        "udink7405@gmail.com",
        "ЗАКЛЮЧЕНИЕ ДОГОВОРА",
        emailMessage.bodyTextMessage,
        "НОВЫЙ ПОСТОЯННЫЙ КЛИЕНТ KANTAR",
        fileArray
      ),

      sendEmail(
        //отправка сообщения администратору
        "sanek.miron2@gmail.com",
        "ЗАКЛЮЧЕНИЕ ДОГОВОРА",
        emailMessage.bodyTextMessage,
        "НОВЫЙ ПОСТОЯННЫЙ КЛИЕНТ KANTAR",
        fileArray
      ),

      sendEmail(
        //отправка сообщения создателю заявки
        email,
        "Заявление на заключение договора Kantar",
        emailMessage.bodyTextMessageUser,
        "KANTAR"
      ),

      //отправка админу Кириллу
      sendSMS("+79991386191",
        `Оформлена заявка 
на ПОДПИСАНИЕ ДОГОВОРА!${sms.messageAdminSMS}`),

      //отправка админу
      sendSMS("+79030404804",
        `Оформлена заявка 
на ПОДПИСАНИЕ ДОГОВОРА!${sms.messageAdminSMS}`),

      //отправка клиенту
      sendSMS(phone,
        sms.messageUserSMS)
    )
  }

  const results = await Promise.allSettled(tasks)

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.log("Task failed:", index, result.reason)
    }
  })

  return response;
}
