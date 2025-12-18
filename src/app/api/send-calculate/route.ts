import { NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/sendEmail"
import { sendSMS } from "@/app/helpers/sendSms";
import fabric from "./lib/fabric";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();


  const {
    agree, client, phoneFrom, phoneWhere, emailFrom, emailWhere, fileArray, sms, emailMessage
  } = await fabric(formData)

  const tasks: Promise<unknown>[] = []

  if (agree) {
    tasks.push(
      sendEmail(//отправка сообщения администратору Кирилл
        "udink7405@gmail.com",
        "Новая заявка",
        emailMessage.bodyTextMessage,
        "НОВАЯ ЗАЯВКА KANTAR",
        fileArray
      ),

      //отправка сообщения администратору
      sendEmail(
        "sanek.miron2@gmail.com",
        "Новая заявка",
        emailMessage.bodyTextMessage,
        "НОВАЯ ЗАЯВКА KANTAR",
        fileArray
      ),

      //отправка сообщения создателю заявки
      sendEmail(
        client === "sender" ? emailFrom : emailWhere,
        "Вы создали заявку на отправление груза KANTAR",
        emailMessage.bodyTextMessageUser
        ,
        "KANTAR"
      ),

      //отправка админу Кириллу
      sendSMS("+79991386191",
        sms.messageAdminSMS),

      //отправка админу мне
      sendSMS("+79030404804",
        sms.messageAdminSMS),

      //отправка клиенту
      sendSMS(`${client === "sender" ? phoneFrom : phoneWhere}`,
        sms.messageUserSMS),
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
          emailMessage.bodyTextMessageUser2
          ,
          "KANTAR"
        ));
      }
    }
  }

  const results = await Promise.allSettled(tasks)

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.log("Task failed:", index, result.reason)
    }
  })

  return response;
}