import { NextResponse } from "next/server";
import { sendEmail } from "@/app/helpers/sendEmail"
import { sendSMS } from "@/app/helpers/sendSms";
import fabric from "./lib/fabric"

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();

  //функция парсинга данных и генерации сообщений
  const {
    agree, phone, email, fileArray, sms, emailMessaege
  } = await fabric(formData)

  if (agree) {
    //отправка сообщения администратору Кирилл
    await sendEmail(
      "udink7405@gmail.com",
      "ЗАКЛЮЧЕНИЕ ДОГОВОРА",
      emailMessaege.bodyTextMessage,
      "НОВЫЙ ПОСТОЯННЫЙ КЛИЕНТ KANTAR",
      fileArray
    );

    await sendEmail(
      //отправка сообщения администратору
      "sanek.miron2@gmail.com",
      "ЗАКЛЮЧЕНИЕ ДОГОВОРА",
      emailMessaege.bodyTextMessage,
      "НОВЫЙ ПОСТОЯННЫЙ КЛИЕНТ KANTAR",
      fileArray
    );

    await sendEmail(
      //отправка сообщения создателю заявки
      email,
      "Заявление на заключение договора Kantar",
      emailMessaege.bodyTextMessageUser,
      "KANTAR"
    );
    //отправка админу Кириллу
    await sendSMS("+79991386191",
      `Оформлена заявка 
на ПОДПИСАНИЕ ДОГОВОРА!${sms.messageAdminSMS}`);

    //отправка админу
    await sendSMS("+79030404804",
      `Оформлена заявка 
на ПОДПИСАНИЕ ДОГОВОРА!${sms.messageAdminSMS}`);

    //отправка клиенту
    await sendSMS(`+7${phone}`,
      sms.messageUserSMS);
  }

  return response;
}
