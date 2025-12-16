// app/api/sms/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from "next/server";

// Твой секрет из TextBee (для проверки подлинности)
const TEXTBEE_SECRET = process.env.TEXTBEE_SECRET;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-textbee-signature");


  // Проверка подписи  
  if (signature !== TEXTBEE_SECRET) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }



  const body = await req.json();







  console.log("TextBee webhook:", body); // отладки



  switch (body.webhookEvent) {
    case "MESSAGE_RECEIVED":
      console.log("Входящее SMS от:", body.sender);
      console.log("Текст:", body.message);
      console.log("Время:", body.receivedAt);
      //  Сохранение в БД 
      break;

    case "MESSAGE_SENT":
      console.log("SMS отправлено (ID:", body.smsId + ")");
      console.log("Получатель:", body.recipient);
      // Обнови статус в своей БД на "отправлено"
      break;

    case "MESSAGE_DELIVERED":
      console.log("SMS доставлено (ID:", body.smsId + ")");
      console.log("Время доставки:", body.deliveredAt);
      // Обнови статус на "доставлено"
      break;

    case "MESSAGE_FAILED":
      console.log("SMS НЕ доставлено (ID:", body.smsId + ")");
      console.log("Ошибка:", body.errorCode, body.errorMessage);
      // Уведоми админа, попробуй переотправить
      break;

    default:
      console.log("Неизвестное событие TextBee:", body.webhookEvent);
  }

  // 200 OK — для TextBee
  return NextResponse.json({ success: true });
}