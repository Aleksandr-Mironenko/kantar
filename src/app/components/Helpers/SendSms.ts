// import axios from 'axios'
// const BASE_URL = 'https://api.textbee.dev/api/v1'

// // EXTBEE_DEVICE_ID = 69415ab1fa641934d138904f
// // TEXTBEE_API_KEY = 3646594d - 14db - 425f - 8361 - b6e560b0fc95

// export async function sendSMS(to: string, text: string) {
//   const response = await axios.post(
//     `${BASE_URL}/gateway/devices/69415ab1fa641934d138904f/send-sms`,
//     {
//       recipients: [to],
//       message: text
//     },
//     { headers: { 'x-api-key': "3646594d-14db-425f-8361-b6e560b0fc95" } }
//   )

//   console.log(response.data)
// }

"use server";

// interface Data { message: string, recipientCount: 1, smsBatchId: string, success: boolean }
// interface Response { data: Data }

const BASE_URL = "https://api.textbee.dev/api/v1";

export async function sendSMS(to: string, text: string) {

  if (!process.env.TEXTBEE_API_KEY) {
    throw new Error("TEXTBEE_API_KEY не задан в .env");
  }
  if (!process.env.TEXTBEE_DEVICE_ID) {
    throw new Error("TEXTBEE_DEVICE_ID не задан в .env");
  }

  const response = await fetch(
    `${BASE_URL}/gateway/devices/${process.env.TEXTBEE_DEVICE_ID}/send-sms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TEXTBEE_API_KEY,
      },
      body: JSON.stringify({
        recipients: [to],
        message: text,
      }),
    }
  );

  const data = await response.json();

  if (data.data.success !== true) {
    console.error("Ошибка от TextBee:", data);
    throw new Error(`TextBee error ${response.status}: ${data.error || data.message || "Неизвестная ошибка"}`);
  }

  console.log("SMS успешно отправлено:", data);
  return data;
}




// export async function sendSMS(to: string, text: string) {
//   const res = await fetch("https://api.textbee.dev/v1/messages", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.TEXTBEE_API_KEY}`,
//     },
//     body: JSON.stringify({
//       to,
//       content: text,
//     }),
//   });

//   console.log("Статус ответа:", res.status); // ← полезно для отладки

//   // Ждём результат
//   const data = await res.json();

//   console.log("Ответ от TextBee:", data);

//   if (!res.ok) {
//     throw new Error(`Ошибка отправки SMS: ${res.status} ${data.error || data.message || "Неизвестная ошибка"}`);
//   }

//   // Добавь проверку на пустой ключ
//   if (!process.env.TEXTBEE_API_KEY) {
//     throw new Error("TEXTBEE_API_KEY не задан в env");
//   }

//   // Логируй запрос (удобно для отладки)
//   console.log("Отправка SMS на:", to, "Текст:", text);

//   return data;
// }