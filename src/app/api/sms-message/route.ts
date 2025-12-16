// app/api/sms/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from "next/server";

// Твой секрет из TextBee (для проверки подлинности)
const TEXTBEE_SECRET = process.env.TEXTBEE_SECRET || "твой-секрет";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-textbee-signature");


  // Проверка подписи  
  if (signature !== TEXTBEE_SECRET) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }



  const body = await req.json();



  //  Определение типа события  
  switch (body.type) {

    // Входящее SMS
    case "message.received":
      console.log("Входящее SMS:", body);

      // Обработка - запись в БД
      break;

    // Успешно отправлено
    case "message.sent":
      console.log("Отправлено:", body.message_id);
      break;

    // Не доставлено
    case "message.failed":
      console.log("Ошибка доставки:", body);
      break;

    // Отчёт о доставке
    case "delivery.receipt":
      console.log("Доставлено:", body);
      break;

    default:
      console.log("Неизвестное событие:", body.type);
  }

  // 200 OK — для TextBee
  return NextResponse.json({ success: true });
}