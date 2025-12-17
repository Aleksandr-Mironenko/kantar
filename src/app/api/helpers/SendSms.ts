"use server";
const BASE_URL = "https://api.textbee.dev/api/v1";

const API_KEY = process.env.TEXTBEE_API_KEY
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID

export async function sendSMS(to: string, text: string) {
  if (!API_KEY) {
    throw new Error("TEXTBEE_API_KEY не задан в .env");
  }
  if (!DEVICE_ID) {
    throw new Error("TEXTBEE_DEVICE_ID не задан в .env");
  }

  const response = await fetch(
    `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
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
