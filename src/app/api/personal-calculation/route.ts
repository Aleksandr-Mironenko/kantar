import { NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/sendEmail"
import { sendSMS } from "@/app/helpers/sendSms";
import fabric from './lib/fabric'

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();

  //функция парсинга данных и генерации сообщений
  const {
    agree, phone, email, fileArray, sms, emailMessage
  } = await fabric(formData)

  const tasks: Promise<unknown>[] = []

  if (agree) {
    //отправка сообщения администратору Кирилл
    tasks.push(
      sendEmail(
        "udink7405@gmail.com",
        "ПЕРСОНАЛЬНЫЙ РАССЧЕТ",
        emailMessage.bodyTextMessage,
        "ЗАПРОС НА ПЕРСОНАЛЬНЫЙ РАССЧЕТ KANTAR",
        fileArray),

      //отправка сообщения администратору
      sendEmail(
        "sanek.miron2@gmail.com",
        "ПЕРСОНАЛЬНЫЙ РАССЧЕТ",
        emailMessage.bodyTextMessage,
        "ЗАПРОС НА ПЕРСОНАЛЬНЫЙ РАССЧЕТ KANTAR",
        fileArray),

      //отправка сообщения создателю заявки
      sendEmail(
        email,
        "Заявка на персональный рассчет Kantar",
        emailMessage.bodyTextMessageUser,
        "KANTAR"),

      // уведомление админу Кириллу
      sendSMS("+79991386191",
        sms.messageAdminSMS),

      // уведомление админу мне
      sendSMS("+79030404804",
        sms.messageAdminSMS),

      //уведомление клиенту
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