import { NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/sendEmail"
import { sendSMS } from "@/app/helpers/sendSms";
import fabric from "./lib/fabric"

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();

  //функция парсинга данных и генерации сообщений
  const {
    agree, phone, email, fileArray, sms, emailMessage
  } = await fabric(formData)

  const tasks: Promise<unknown>[] = []

  if (agree) {

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
