import { sendEmail } from "@/app/helpers/sendEmail";

export default async function retry<T>(
  fn: () => Promise<T>,
  { retries = 5, delay = 50 } = {}
): Promise<T> {
  let lastError;

  for (let i = 0; i < retries; i++) {//перебор количества попыток
    try {
      //попытка выполнить функцию
      return await fn();
    } catch (e) {
      //если ошибка, сохраняю ее и жду задержку перед следующей попыткой
      lastError = e;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
  //отправка сообщения об ошибке
  await sendEmail(
    "sanek.miron2@gmail.com",
    `Ошибка `,
    `<p>Возникла ошибка при выполнении: ${lastError}
    нужно обратить внимание. создан заказ и нужно проверить его вручную.</p>`,
    "KANTAR dev",
  );
  throw lastError;
}

// tasks.push(
//   sendEmail(//отправка сообщения администратору Кирилл
//     "udink7405@gmail.com",
//     "Новая заявка",
//     emailMessage.bodyTextMessage,
//     "НОВАЯ ЗАЯВКА KANTAR",
//     fileArray
//   ),