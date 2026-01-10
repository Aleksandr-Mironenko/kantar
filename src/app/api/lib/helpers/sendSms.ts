"use server";
const BASE_URL = process.env.DATABASE_URL

const API_KEY = process.env.TEXTBEE_API_KEY
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID


interface TextBeeSuccessResponse {
  data: {
    ok: true;
    [key: string]: unknown;
  };
}

interface TextBeeErrorResponse {
  data?: {
    ok: false;
    error?: string;
    message?: string;
  };
  error?: string;
  message?: string;
}

type TextBeeResponse = TextBeeSuccessResponse | TextBeeErrorResponse;

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function sendSMS(to: string, text: string) {
  if (!API_KEY) {
    throw new Error("TEXTBEE_API_KEY не задан");
  }
  if (!DEVICE_ID) {
    throw new Error("TEXTBEE_DEVICE_ID не задан в");
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

  const rawText = await response.text();

  //   // if (data.data.success !== true) {
  //   //   console.error("Ошибка от TextBee:", data);
  //   //   throw new Error(`TextBee error ${response.status}: ${data.error || data.message || "Неизвестная ошибка"}`);
  //   // }


  //   if (!data.data.ok) {
  //     console.error("Ошибка от TextBee:", data);
  //     throw new Error(`TextBee error ${response.status}: ${data.error || data.message || "Неизвестная ошибка"}`);
  //   }
  //   // console.log("SMS успешно отправлено:", data);
  const parsed = rawText
    ? safeJsonParse<TextBeeResponse>(rawText)
    : null;

  if (!response.ok) {
    console.error("TextBee HTTP error", {
      status: response.status,
      body: rawText,
    });
    throw new Error(`TextBee HTTP ${response.status}`);
  }

  // Если тело пустое — считаем успехом
  if (!parsed) {
    return true;
  }

  // Явная проверка ошибки API
  if ("data" in parsed && parsed.data?.ok === false) {
    console.error("TextBee API error:", parsed);
    throw new Error("TextBee rejected SMS");
  }

  return true;
}
