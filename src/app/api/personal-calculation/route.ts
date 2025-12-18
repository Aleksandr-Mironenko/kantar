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

  if (agree) {
    //отправка сообщения администратору Кирилл
    await sendEmail(
      "udink7405@gmail.com",
      "ПЕРСОНАЛЬНЫЙ РАССЧЕТ",
      emailMessage.bodyTextMessage,
      "ЗАПРОС НА ПЕРСОНАЛЬНЫЙ РАССЧЕТ KANTAR",
      fileArray
    );

    //отправка сообщения администратору
    await sendEmail(
      "sanek.miron2@gmail.com",
      "ПЕРСОНАЛЬНЫЙ РАССЧЕТ",
      emailMessage.bodyTextMessage,
      "ЗАПРОС НА ПЕРСОНАЛЬНЫЙ РАССЧЕТ KANTAR",
      fileArray
    );

    //отправка сообщения создателю заявки
    await sendEmail(
      email,
      "Заявка на персональный рассчет Kantar",
      emailMessage.bodyTextMessageUser,
      "KANTAR"
    );
  }

  // уведомление админу Кириллу
  await sendSMS("+79991386191",
    sms.messageAdminSMS);

  // уведомление админу мне
  await sendSMS("+79030404804",
    sms.messageAdminSMS);

  //уведомление клиенту
  await sendSMS(`+7${phone}`,
    sms.messageUserSMS);

  return response;
}