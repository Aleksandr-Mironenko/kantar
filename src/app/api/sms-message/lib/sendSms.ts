"use server"
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

  if (!res.ok) {
    throw new Error("Ошибка отправки SMS через TextBee");
  }

  return await res.json();
}