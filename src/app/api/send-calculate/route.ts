import { NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/sendEmail"
import { sendSMS } from "@/app/helpers/sendSms";
import fabric from "./lib/fabric";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();


  const {
    agree, client, phoneFrom, phoneWhere, emailFrom, emailWhere, fileArray, sms, emailMessaege
  } = await fabric(formData)

  if (agree) {
    await sendEmail(//отправка сообщения администратору Кирилл
      "udink7405@gmail.com",
      "Новая заявка",
      emailMessaege.bodyTextMessage
      ,

      "НОВАЯ ЗАЯВКА KANTAR",
      fileArray
    );

    await sendEmail(//отправка сообщения администратору
      "sanek.miron2@gmail.com",
      "Новая заявка",
      emailMessaege.bodyTextMessage
      ,
      "НОВАЯ ЗАЯВКА KANTAR",
      fileArray
    );

    await sendEmail(//отправка сообщения создателю заявки
      client === "sender" ? emailFrom : emailWhere,
      "Вы создали заявку на отправление груза KANTAR",
      emailMessaege.bodyTextMessageUser
      ,
      "KANTAR"
    );

    if (emailWhere !== emailFrom) {//отправка сообщения второй стороне
      // if (client === "sender" ? emailWhere : emailFrom) {
      if (client !== "sender") {
        await sendEmail(
          // client === "sender" ? emailWhere : emailFrom,
          emailFrom,
          // client === "sender" ? "Вы указаны получателем" : "Вы указаны отправителем",
          "Вы указаны отправителем",
          emailMessaege.bodyTextMessageUser2
          ,
          "KANTAR"
        );//нужно ли уведомлять отрпавителя о выбранных габаритах и весе(для соответствия)
      }
    }

    //отправка админу Кириллу
    await sendSMS("+79991386191",
      sms.messageAdminSMS);

    //отправка админу мне
    await sendSMS("+79030404804",
      sms.messageAdminSMS);

    //отправка клиенту
    await sendSMS(`+7${client === "sender" ? phoneFrom : phoneWhere}`,
      sms.messageUserSMS);
  }
  return response;
}