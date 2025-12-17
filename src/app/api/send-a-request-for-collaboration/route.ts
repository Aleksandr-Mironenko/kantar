import { NextResponse } from "next/server";
import { sendEmail } from "@/app/api/helpers/sendEmail"
// import { readState, dataFile } from "../helpers/getState"; 
// import { boolean } from "yup";
import { sendSMS } from "@/app/api/helpers/SendSms";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();

  const filesWithId: { id: number; file: File }[] = [];
  let agree: boolean = false;
  let client: string = "";
  let name: string = "";
  let phone: string = "";
  let email: string = "";
  let ipName: string = "";
  let realAddressIp: string = "";
  let innip: string = "";
  let ogrnip: string = "";
  let rss: string = "";
  let bik: string = "";
  let kss: string = "";
  let comment: string = "";
  let companyName: string = "";
  let nameGD: string = "";
  let legalAddress: string = "";
  let realAddress: string = "";
  let innOoo: string = "";
  let kpp: string = "";
  let ogrn: string = "";
  let passport: string = "";

  for (const [key, value] of formData.entries()) {
    if (key === "client" && typeof value === "string") {
      if (value === "ooo") client = "ooo";
      else if (value === "ip") client = "ip";
      else if (value === "private") client = "private";
    }
  }

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
      if (client === "ooo") {
        if (key === "client") {
          client = value
        } else if (key === "name") {
          name = value
        } else if (key === "phone") {
          phone = value
        } else if (key === "email") {
          email = value
        } else if (key === "comment") {
          comment = value
        } else if (key === "companyName") {
          companyName = value
        } else if (key === "nameGD") {
          nameGD = value
        } else if (key === "legalAddress") {
          legalAddress = value
        } else if (key === "realAddress") {
          realAddress = value
        } else if (key === "innOoo") {
          innOoo = value
        } else if (key === "kpp") {
          kpp = value
        } else if (key === "ogrn") {
          ogrn = value
        } else if (key === "rss") {
          rss = value
        } else if (key === "bik") {
          bik = value
        } else if (key === "kss") {
          kss = value
        }
      }
      else if (client === "ip") {
        if (key === "client") {
          client = value
        } else if (key === "name") {
          name = value
        } else if (key === "phone") {
          phone = value
        } else if (key === "email") {
          email = value
        } else if (key === "comment") {
          comment = value
        } else if (key === "ipName") {
          ipName = value
        } else if (key === "realAddressIp") {
          realAddressIp = value
        } else if (key === "innip") {
          innip = value
        } else if (key === "ogrnip") {
          ogrnip = value
        } else if (key === "rss") {
          rss = value
        } else if (key === "bik") {
          bik = value
        } else if (key === "kss") {
          kss = value
        }
      }
      else if (client === "private") {
        if (key === "ooo") {
          client = value
        } else if (key === "name") {
          name = value
        } else if (key === "phone") {
          phone = value
        } else if (key === "email") {
          email = value
        } else if (key === "comment") {
          comment = value
        } else if (key === "passport") {
          passport = value
        }
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

  const bodyTextMessage = (
    client === "ooo" ?
      (`
        <p>Новый запрос на заключение договора в ${createTime}  
        <p>Запрос поступил от ${name}</p>
        <p>Клиент является OOO</p>
        <p>Контактный номер ${phone} </p>
        <p>Эл. почта ${email}</p>
        <p>Важное для клиента: ${comment}</p>
        <p>Имя ген. директора: ${nameGD}</p>
        <p>Название организации: ${companyName}</p>
        <p>Юр адрес организации: ${legalAddress}</p>
        <p>Фактический адрес: ${realAddress} </p>
        <p>Реквизиты:</p>
        <p>ИНН: ${innOoo} 
        <p>КПП: ${kpp}  </p>
        <p>ОРГН: ${ogrn}   </p>
        <p>Рассчетный счет: ${rss} </p>
        <p>БИК: ${bik}</p>
        <p>Коррп. счет: ${kss}</p>
        `) :
      client === "ip" ?
        (`
        <p>Новый запрос на заключение договора в ${createTime}  </p>
        <p>Запрос поступил от ${name}</p>
        <p>Клиент является ИП</p>
        <p>Контактный номер ${phone} </p>
        <p>Эл. почта ${email}</p>
        <p>Важное для клиента: ${comment}</p>
        <p>Имя ИП: ${ipName}</p>
        <p>Адрес регистрации ИП: ${realAddressIp}</p>
        <p>Реквизиты:</p>
        <p>ИНН: ${innip}  </p>
        <p>ОРГН: ${ogrnip}   </p>
        <p>Рассчетный счет: ${rss} </p>
        <p>БИК: ${bik}</p>
        <p>Коррп. счет: ${kss}</p>
         `) :
        client === "private" ?
          (`
        <p>Новый запрос на заключение договора в ${createTime}  </p>
        <p>Запрос поступил от ${name}</p>
        <p>Клиент является частным лицом</p>
        <p>Контактный номер ${phone} </p>
        <p>Эл. почта ${email}</p>
        <p>Важное для клиента: ${comment}</p>
        <p>Пасспорт клиента: ${passport}</p>
         `) : ""
  )

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
      "ЗАКЛЮЧЕНИЕ ДОГОВОРА",
      bodyTextMessage,
      "НОВЫЙ ПОСТОЯННЫЙ КЛИЕНТ KANTAR",
      filesWithId.map(f => f.file)
    );

    await sendEmail(//отправка сообщения администратору
      "sanek.miron2@gmail.com",
      "ЗАКЛЮЧЕНИЕ ДОГОВОРА",
      bodyTextMessage,
      "НОВЫЙ ПОСТОЯННЫЙ КЛИЕНТ KANTAR",
      filesWithId.map(f => f.file)
    );

    await sendEmail(//отправка сообщения создателю заявки
      email,
      "Заявление на заключение договора Kantar",
      `
    <div style="font-size:15px"> 
      <p style="font-size:20px">Спасибо за Ваш выбор</p>
       <p style="font-size:20px">Мы обработаем заявку, подготовим документы и свяжемся с вами с целью назначить встречу для подписания договора</p>
       <p style="font-size:20px">Вам будет предоставлен личный промокод для получения постоянной скидки как постоянному клиенту и реферальный код</p>
       <p style="font-size:20px">Больше подробностей про условия реферальной программы Вам расскажет наш представитель
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

  let messageAdmin
  if (client === "ooo") {
    messageAdmin = `(ООО)
ФИО: ${name},

Телефон: ${phone},

Почта: ${email},

Комментарий:
${comment},

Название:
${companyName},

ФИО Ген Директора:
${nameGD},

Юр. адрес:
${legalAddress},

Факт адрес:
${realAddress},

ИНН: ${innOoo},

КПП: ${kpp},

ОГРН: ${ogrn},

Рассчетный счет:
${rss},

БИК: ${bik},

Корр счет:
${kss}`

  } else if (client === "ip") {
    messageAdmin = `(ИП)
ФИО: ${name},

Телефон: ${phone},

Почта: ${email},

Комментарий:
${comment},

Имя ИП:
${ipName},

Адрес регистрации:
${realAddressIp},

ИНН: ${innip},

ОГРН:
${ogrnip},

Рассчетный счет:
${rss},

БИК: ${bik},

Корр счет:
${kss}`
  } else if (client === "private") {
    messageAdmin = `
Частное лицо

ФИО: ${name},

Паспорт: ${passport},
 
Телефон: ${phone},

Почта: ${email},

Комментарий:
${comment}
    `
  }


  //отправка админу Кириллу
  await sendSMS("+79991386191",
    `Оформлена заявка 
на ПОДПИСАНИЕ ДОГОВОРА!${messageAdmin}`);

  //отправка админу
  await sendSMS("+79030404804",
    `Оформлена заявка 
на ПОДПИСАНИЕ ДОГОВОРА!${messageAdmin}`);

  //отправка клиенту
  await sendSMS(`+7${phone}`,
    `Запрос на подписание договора отправлен.
Ожидайте звонка сотрудника. 
Контактный номер телефона +79101056423`);

  return response;
  // return NextResponse.json({ success: true })
}
