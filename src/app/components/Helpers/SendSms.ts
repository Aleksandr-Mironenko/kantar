"use server";


const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = 'YOUR_API_KEY';
const DEVICE_ID = 'YOUR_DEVICE_ID';
export async function sendSMS(to: string, text: string) {
  const response = await fetch(
    `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        recipients: ['+1234567890'],
        message: 'Hello from TextBee!'
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data
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