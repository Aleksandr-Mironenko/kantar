"use server";

export async function sendSMS(to: string, text: string) {
  const res = await fetch("https://api.textbee.dev/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.TEXTBEE_API_KEY}`,
    },
    body: JSON.stringify({
      to,
      content: text,
    }),
  });

  console.log("Статус ответа:", res.status); // ← полезно для отладки

  // Ждём результат
  const data = await res.json();

  console.log("Ответ от TextBee:", data);

  if (!res.ok) {
    throw new Error(`Ошибка отправки SMS: ${res.status} ${data.error || data.message || "Неизвестная ошибка"}`);
  }

  // Добавь проверку на пустой ключ
  if (!process.env.TEXTBEE_API_KEY) {
    throw new Error("TEXTBEE_API_KEY не задан в env");
  }

  // Логируй запрос (удобно для отладки)
  console.log("Отправка SMS на:", to, "Текст:", text);

  return data;
}