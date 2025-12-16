import { NextResponse } from "next/server";
import { sendEmail } from "@/app/api/helpers/sendEmail"
// import { readState, dataFile } from "../helpers/getState"; 
// import { boolean } from "yup";
import { sendSMS } from "@/app/components/Helpers/SendSms";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();

  const filesWithId: { id: number; file: File }[] = [];
  let agree: boolean = false;
  let name: string = "";
  let phone: string = "";
  let email: string = "";
  let comment: string = "";




  for (const [key, value] of formData.entries()) {
    const match = key.match(/^files\[(\d+)\]$/);

    if (match && value instanceof File) {
      const id = Number(match[1]);
      filesWithId.push({ id, file: value });
      continue;
    }
    else if (key === "agree") {
      agree = value === "1" ? true : false
    } else if (typeof value === "string") {
      if (key === "name") {
        name = value
      } else if (key === "phone") {
        phone = value
      } else if (key === "email") {
        email = value
      } else if (key === "comment") {
        comment = value
      }
    }
  }

  const now = new Date();
  const validTime = (): string => {
    const min: number = now.getMinutes();
    const minutes = min < 10 ? `0${min}` : String(min)
    const h: number = now.getHours();
    const hours = h < 10 ? `0${h}` : String(h)
    return `${hours}:${minutes}`
  }
  const createTime = validTime()

  const bodyTextMessage =
    (`
        <p>Новый запрос на рассчет стоимости отправки (не экспресс) ${createTime}  
        <p>Запрос поступил от ${name}</p>
        <p>Контактный номер ${phone} </p>
        <p>Эл. почта ${email}</p>
        <p>Важное для клиента: ${comment}</p>
        `)

  // const yandexMapsLinkFrom = `https://yandex.ru/maps/?text=${encodeURIComponent(
  //   [adressFrom]
  //     .filter(Boolean)
  //     .join(", ")
  // )}`;

  // const yandexMapsLinkWhere = `https://yandex.ru/maps/?text=${encodeURIComponent(
  //   [adressWhere]
  //     .filter(Boolean)
  //     .join(", ")
  // )}`;

  if (agree) {
    await sendEmail(//отправка сообщения администратору Кирилл
      "udink7405@gmail.com",
      "ПЕРСОНАЛЬНЫЙ РАССЧЕТ",
      bodyTextMessage,
      "ЗАПРОС НА ПЕРСОНАЛЬНЫЙ РАССЧЕТ KANTAR",
      filesWithId.map(f => f.file)
    );

    await sendEmail(//отправка сообщения администратору
      "sanek.miron2@gmail.com",
      "ПЕРСОНАЛЬНЫЙ РАССЧЕТ",
      bodyTextMessage,
      "ЗАПРОС НА ПЕРСОНАЛЬНЫЙ РАССЧЕТ KANTAR",
      filesWithId.map(f => f.file)
    );


    await sendEmail(//отправка сообщения создателю заявки
      email,
      "Заявка на персональный рассчет Kantar",
      `
    <div style="font-size:15px"> 
      <p style="font-size:20px">Спасибо за Ваш выбор</p>
       <p style="font-size:20px">Мы обработаем заявку, подготовим персональный рассчет и дополнительно свяжемся с вами</p>
       <p style="font-size:20px">Вам будет предоставлен полный рассчет стоимости доставки, в зависимости от видов перевозки и ориентировочное время в пути</p>
       <p style="font-size:20px">Мы стремимся предложить лучшие условия своим клиентам. </p>
       <p style="font-size:20px">Лучшие предложения по экспресс доставке или персональным отправкам предоставляются при заключении договора на постоянные услуги.</p>
       <p style="font-size:20px">Вы можете отправить заявление на составление договора  (по ссылке!!!!!!)</p>
    </div>
     <p style="font-size:20px">Для разрешения срочных вопросов, позвоните по телефону</p>
          <div style="display:inline-block; text-decoration: none; border-radius:7px; margin:10px auto; background-color:#ff0d01; padding:10px 25px">
            <a style="font-weight:700; font-size:15px; margin:0 auto; color:white" href="tel:+79101056423">+7 910 105 64 23</a>
          </div>
        </div>
   `,
      "KANTAR"
    );
  }

  // уведомление админу Кириллу
  await sendSMS("+79991386191",
    `Оформлена заявка 
на ПЕРСОНАЛЬНЫЙ РАССЧЕТ! 
ФИО:${name},
Телефон:${phone},
Почта:${email},
Комментарий:${comment}`);

  // уведомление админу мне
  await sendSMS("+79030404804",
    `Оформлена заявка 
на ПЕРСОНАЛЬНЫЙ РАССЧЕТ! 
ФИО:${name},
Телефон:${phone},
Почта:${email},
Комментарий:${comment}`);

  //уведомление клиенту
  await sendSMS(`+7${phone}`,
    `Запрос на персональный рассчет отправлен. 
Ожидайте звонка сотрудника. 
Контактный номер телефона +79101056423`);

  return response;
  // return NextResponse.json({ success: true })
}
