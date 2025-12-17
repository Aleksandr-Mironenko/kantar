import { NextResponse } from "next/server";
import { sendEmail } from "@/app/api/helpers/SendEmail"
// import { readState, dataFile } from "../helpers/getState"; 
// import { boolean } from "yup";
import { Place, Country, City } from '@/app/components/DTO/DTO'
import { sendSMS } from "@/app/api/helpers/SendSms";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  const formData = await req.formData();


  const filesWithId: { id: number; file: File }[] = [];


  let agree: boolean = false;
  let isFinalHeft: number = 0;
  let price: number = 0;
  let count: number = 0;
  let fromCountryObj: Country = { id: 0, name: "", zone: 0 };
  let whereCountryObj: Country = { id: 0, name: "", zone: 0 };
  let fromCityObj: City | null = null;
  let whereCityObj: City | null = null;
  let showInvois: boolean = false;
  let nameFrom: string = "";
  let nameWhere: string = "";
  let phoneFrom: string = "";
  let phoneWhere: string = "";
  let emailFrom: string = "";
  let emailWhere: string = "";
  let adressFrom: string = "";
  let adressWhere: string = "";
  let document: string = "";
  let from: string = "";
  let where: string = "";
  let indexFrom: string = "";
  let indexWhere: string = "";
  let client: string = "";
  let places: Place[] | [] = [];
  let fs: number = 0;
  let fsRF: number = 0;
  let koefficient: number = 0;
  let descriptionOfCargo: string = ""

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^files\[(\d+)\]$/);

    if (match && value instanceof File) {
      const id = Number(match[1]);
      filesWithId.push({ id, file: value });
      continue;
    }
    if (typeof value === "string") {
      if (key === "agree") {
        agree = value === "1" ? true : false
      } else if (key === "showInvois") {
        showInvois = value === "1" ? true : false
      } else if (key === "isFinalHeft") {
        isFinalHeft = Number(value)
      } else if (key === "price") {
        price = Number(value)
      } else if (key === "count") {
        count = Number(value)
      } else if (key === "fs") {
        fs = Number(value)
      } else if (key === "fsRF") {
        fsRF = Number(value)
      } else if (key === "koefficient") {
        koefficient = Number(value)
      } else if (key === "fromCountryObj") {
        fromCountryObj = JSON.parse(value as string)
      } else if (key === "fromCityObj") {
        fromCityObj = JSON.parse(value as string)
      } else if (key === "whereCountryObj") {
        whereCountryObj = JSON.parse(value as string)
      } else if (key === "whereCityObj") {
        whereCityObj = JSON.parse(value as string)
      } else if (key === "places") {
        places = JSON.parse(value as string)
      } else if (key === "nameFrom") {
        nameFrom = value
      } else if (key === "nameWhere") {
        nameWhere = value
      } else if (key === "phoneFrom") {
        phoneFrom = value
      } else if (key === "phoneWhere") {
        phoneWhere = value
      } else if (key === "emailFrom") {
        emailFrom = value
      } else if (key === "emailWhere") {
        emailWhere = value
      } else if (key === "indexFrom") {
        indexFrom = value
      } else if (key === "indexWhere") {
        indexWhere = value
      } else if (key === "adressFrom") {
        adressFrom = value
      } else if (key === "adressWhere") {
        adressWhere = value
      } else if (key === "document") {
        document = value
      } else if (key === "from") {
        from = value
      } else if (key === "where") {
        where = value
      } else if (key === "client") {
        client = value
      } else if (key === "descriptionOfCargo") {
        descriptionOfCargo = value
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

  const mapPlaces = places.map(el => (
    `
  <li key={el.id} style="border:3px solid red; gap:20%; border-radius:15px; margin-top:10px; padding:15px"}} >
    <p style="margin: 10px 5px; border-bottom:3px solid red"} >Количество: ${el.places} </p>
    <div style="display: flex; gap:20%; justify-content: space-between; flex-direction:row">
      <div style="margin-right: 20%">
        <p style="margin: 5px">Длина: <b>${el.length} см. </b></p>
        <p style="margin: 5px">Ширина: <b>${el.width} см. </b></p>
        <p style="margin: 5px">Высота: <b>${el.height} см. </b></p>
      </div>
      <div>
        <p style="margin: 5px">Вес каждого места: <b>${el.heft} кг. </b></p>
        <p style="margin: 5px">Объемный вес каждого места: <b>${el.volume} кг. </b></p>
      </div>
    </div>
  </li>
  `
  )
  )

  const yandexMapsLinkFrom = `https://yandex.ru/maps/?text=${encodeURIComponent(
    [adressFrom]
      .filter(Boolean)
      .join(", ")
  )}`;

  const yandexMapsLinkWhere = `https://yandex.ru/maps/?text=${encodeURIComponent(
    [adressWhere]
      .filter(Boolean)
      .join(", ")
  )}`;

  await sendEmail(//отправка сообщения администратору Кирилл
    "udink7405@gmail.com",
    "Новая заявка",
    `
    <div style="font-size:15px"> 
      <p style="margin: 5px"><b>${client === "sender" ? nameFrom : nameWhere}</b> в ${createTime} создал новую заявку.</p>
      <p style="margin: 5px"><b>${document === "document" ? "ДОКУМЕНТЫ" : "ГРУЗ"}</b></p>
      <p style="margin: 5px; text-decoration: underline">Описание груза: <b>${descriptionOfCargo}</b></p>
      <p style="margin: 5px">Заказчик <b style="font-size:15px">${client === "sender" ? "отправитель" : "получатель"}</b></p>
      <p style="margin: 5px">Рассчетный вес: <b>${isFinalHeft} кг.</b></p>
      <p style="margin: 5px">Полная стоимость: <b>${Math.ceil(price)} р.</b></p>
      <p style="margin: 5px">Всего мест: <b>${count}</b> </p>
      <p style="margin: 5px">В рассчете учтены: </p>
      ${(fromCityObj && !whereCityObj) || (!fromCityObj && whereCityObj) ?
      `<p style="margin: 5px; margin-left:12px">Транспортный налог(РФ): <b>${fsRF * 100 - 100} %</b></p>` :
      `<p style="margin: 5px; margin-left:12px">Транспортный налог(не РФ): <b>${fs * 100 - 100} %</b></p>`}
      <p style="margin: 5px; margin-left:12px">Скидка: <b>${koefficient * 100}% </b></p > 
      <div style="display:flex; justify-content:space-between; flex-direction:row">
        <div style="border:3px solid red; margin-right:20%; padding:15px; border-radius:15px">
          <p style="margin: 5px; font-size:25px; border-bottom:3px solid red">Отправитель</p>
          <p style="margin: 5px"><b>${nameFrom}</b></p>
          <p style="margin: 5px">Телефон: <b><a style="font-size:15px; padding:7px" href="tel:+7${phoneFrom}">+7${phoneFrom}</a></b></p> 
          <p style="margin: 5px">Эл.почта: <b><a style="font-size:15px; padding:7px" href="mailto:${emailFrom}">${emailFrom}</a></b></p>
          <p style="margin: 5px">Полный адрес:</p>
          <p style="margin: 5px"><b>${adressFrom}</b></p>
          <a href="${yandexMapsLinkFrom}" style="background:#e31e24; color:white; padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:600; display:inline-block;" target="_blank">Отправитель на Яндекс.Картах</a> 
          <p style="margin: 5px">Страна: <b>${fromCountryObj.name}</b></p>
          <p style="margin: 5px">Индекс: <b>${indexFrom}</b></p>
          ${fromCityObj ? `<p style="margin: 5px">Город: <b>${fromCityObj.name}</b> </p>` : ""}
        </div>
        <div style="border:3px solid red; padding:15px; border-radius:15px">
          <p style="margin: 5px; font-size:25px; border-bottom:3px solid red">Получатель </p>
          <p style="margin: 5px"><b>${nameWhere}</b></p>
          <p style="margin: 5px">Телефон: <b><a style="font-size:15px; padding:7px" href="tel:+7${phoneWhere}">+7${phoneWhere}</a></b></p> 
          <p style="margin: 5px">Эл.почта: <b><a style="font-size:15px; padding:7px" href="mailto:${emailWhere}">${emailWhere}</a></b></p>  
          <p style="margin: 5px">Полный адрес:</p>
          <p style="margin: 5px"><b>${adressWhere}</b></p>
          <a href="${yandexMapsLinkWhere}" style="background:#e31e24; color:white; padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:600; display:inline-block;" target="_blank">Получатель на Яндекс.Картах</a>
          <p style="margin: 5px">Страна: <b>${whereCountryObj.name}</b> </p>
          <p style="margin: 5px">Индекс: <b>${indexWhere}</b> </p>
          ${whereCityObj ? `<p style="margin: 5px">Город: <b>${whereCityObj.name}</b> </p>` : ""}
        </div>
      </div>
      <ol style="list-style: none">
        ${mapPlaces}
      </ol> 
    </div>
    `,
    "НОВАЯ ЗАЯВКА KANTAR",
    filesWithId.map(f => f.file)
  );

  await sendEmail(//отправка сообщения администратору
    "sanek.miron2@gmail.com",
    "Новая заявка",
    `
    <div style="font-size:15px"> 
      <p style="margin: 5px"><b>${client === "sender" ? nameFrom : nameWhere}</b> в ${createTime} создал новую заявку.</p>
      <p style="margin: 5px"><b>${document === "document" ? "ДОКУМЕНТЫ" : "ГРУЗ"}</b></p>
      <p style="margin: 5px; text-decoration: underline">Описание груза: <b>${descriptionOfCargo}</b></p>
      <p style="margin: 5px">Заказчик <b style="font-size:15px">${client === "sender" ? "отправитель" : "получатель"}</b></p>
      <p style="margin: 5px">Рассчетный вес: <b>${isFinalHeft} кг.</b></p>
      <p style="margin: 5px">Полная стоимость: <b>${Math.ceil(price)} р.</b></p>
      <p style="margin: 5px">Всего мест: <b>${count}</b> </p>
      <p style="margin: 5px">В рассчете учтены: </p>
      ${(fromCityObj && !whereCityObj) || (!fromCityObj && whereCityObj) ?
      `<p style="margin: 5px; margin-left:12px">Транспортный налог(РФ): <b>${fsRF * 100 - 100} %</b></p>` :
      `<p style="margin: 5px; margin-left:12px">Транспортный налог(не РФ): <b>${fs * 100 - 100} %</b></p>`}
      <p style="margin: 5px; margin-left:12px">Скидка: <b>${koefficient * 100}% </b></p > 
      <div style="display:flex; justify-content:space-between; flex-direction:row">
        <div style="border:3px solid red; margin-right:20%; padding:15px; border-radius:15px">
          <p style="margin: 5px; font-size:25px; border-bottom:3px solid red">Отправитель</p>
          <p style="margin: 5px"><b>${nameFrom}</b></p>
          <p style="margin: 5px">Телефон: <b><a style="font-size:15px; padding:7px" href="tel:+7${phoneFrom}">+7${phoneFrom}</a></b></p> 
          <p style="margin: 5px">Эл.почта: <b><a style="font-size:15px; padding:7px" href="mailto:${emailFrom}">${emailFrom}</a></b></p>
          <p style="margin: 5px">Полный адрес:</p>
          <p style="margin: 5px"><b>${adressFrom}</b></p>
          <a href="${yandexMapsLinkFrom}" style="background:#e31e24; color:white; padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:600; display:inline-block;" target="_blank">Отправитель на Яндекс.Картах</a>
          <p style="margin: 5px">Страна: <b>${fromCountryObj.name}</b></p>
          <p style="margin: 5px">Индекс: <b>${indexFrom}</b></p>
          ${fromCityObj ? `<p style="margin: 5px">Город: <b>${fromCityObj.name}</b> </p>` : ""}
        </div>
        <div style="border:3px solid red; padding:15px; border-radius:15px">
          <p style="margin: 5px; font-size:25px; border-bottom:3px solid red">Получатель</p>
          <p style="margin: 5px"><b>${nameWhere}</b></p>
          <p style="margin: 5px">Телефон: <b><a style="font-size:15px; padding:7px" href="tel:+7${phoneWhere}">+7${phoneWhere}</a></b></p> 
          <p style="margin: 5px">Эл.почта: <b><a style="font-size:15px; padding:7px" href="mailto:${emailWhere}">${emailWhere}</a></b></p>  
          <p style="margin: 5px">Полный адрес:</p>
          <p style="margin: 5px"><b>${adressWhere}</b></p>
          <a href="${yandexMapsLinkWhere}" style="background:#e31e24; color:white; padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:600; display:inline-block;" target="_blank">Получатель на Яндекс.Картах</a> 
          <p style="margin: 5px">Страна: <b>${whereCountryObj.name}</b></p>
          <p style="margin: 5px">Индекс: <b>${indexWhere}</b> </p>
          ${whereCityObj ? `<p style="margin: 5px">Город: <b>${whereCityObj.name}</b> </p>` : ""}
        </div>
      </div>
      <ol style="list-style: none">
        ${mapPlaces}
      </ol> 
    </div>
    `,
    "НОВАЯ ЗАЯВКА KANTAR",
    filesWithId.map(f => f.file)
  );

  await sendEmail(//отправка сообщения создателю заявки
    client === "sender" ? emailFrom : emailWhere,
    "Вы создали заявку на отправление груза KANTAR",
    `
    <div style="font-size:15px"> 
      <p style="font-size:20px">Проверьте детали отправления</p>
      <div style="display:flex; justify-content:space-between; flex-direction:row">
        <div style="border:3px solid red; margin-right:20%; padding:15px; border-radius:15px">
          <p style="margin: 5px; font-size:25px; border-bottom:3px solid red">Отправитель</p>
          <p style="margin: 5px"><b>${nameFrom}</b></p>
          <p style="margin: 5px">Телефон: <b><a style="font-size:15px; padding:7px" href="tel:+7${phoneFrom}">+7${phoneFrom}</a></b></p> 
          <p style="margin: 5px">Эл.почта: <b><a style="font-size:15px; padding:7px" href="mailto:${emailFrom}">${emailFrom}</a></b></p>
          <p style="margin: 5px">Полный адрес:</p>
          <p style="margin: 5px"><b>${adressFrom}</b></p>
          <p style="margin: 5px">Страна: <b>${fromCountryObj.name}</b></p>
          <p style="margin: 5px">Индекс: <b>${indexFrom}</b></p>
          ${fromCityObj ? `<p style="margin: 5px">Город: <b>${fromCityObj.name}</b> </p>` : ""}
        </div>
        <div style="border:3px solid red; padding:15px; border-radius:15px">
          <p style="margin: 5px; font-size:25px; border-bottom:3px solid red">Получатель </p>
          <p style="margin: 5px"><b>${nameWhere}</b></p>
          <p style="margin: 5px">Телефон: <b><a style="font-size:15px; padding:7px" href="tel:+7${phoneWhere}">+7${phoneWhere}</a></b></p> 
          <p style="margin: 5px">Эл.почта: <b><a style="font-size:15px; padding:7px" href="mailto:${emailWhere}">${emailWhere}</a></b></p>
          <p style="margin: 5px">Полный адрес:</p>
          <p style="margin: 5px"><b>${adressWhere}</b></p>
          <p style="margin: 5px">Страна: <b>${whereCountryObj.name}</b> </p>
          <p style="margin: 5px">Индекс: <b>${indexWhere}</b> </p>
          ${whereCityObj ? `<p style="margin: 5px">Город: <b>${whereCityObj.name}</b> </p>` : ""}
        </div>
      </div>
      <ol style="list-style: none">
        ${mapPlaces}
      </ol>
      <p style="margin: 5px">Рассчетный вес: <b>${isFinalHeft} кг.</b></p>
      <p style="margin: 5px">Всего мест: <b>${count}</b> </p>
      <p style="margin: 5px">Скидка: <b>${koefficient * 100}% </b></p >  
      <p style="margin: 5px">Итоговая стоимость с учетом скидки: <b>${Math.ceil(price)} р.</b></p>
      <div style="display:inline-block; text-decoration: none; border-radius:7px; margin:10px auto; background-color:#ff0d01; padding:10px 25px">
        <a style="font-weight:700; font-size:15px; margin:0 auto; color:white" href="tel:+79101056423">+7 910 105 64 23</a>
      /div>
    </div>
   `,
    "KANTAR"
  );

  if (emailWhere !== emailFrom) {//отправка сообщения второй стороне
    // if (client === "sender" ? emailWhere : emailFrom) {
    if (client !== "sender") {
      await sendEmail(
        // client === "sender" ? emailWhere : emailFrom,
        emailFrom,
        // client === "sender" ? "Вы указаны получателем" : "Вы указаны отправителем",
        "Вы указаны отправителем",
        //          `
        // <div style="font-size:15px"> 
        //  ${client === "sender" ? `<p>Здраствуйте, ${nameWhere}!</p>` : `<p>Здраствуйте, ${nameFrom}!</p>`}
        // <p>${client === "sender" ? "Вы указаны получателем отправления" : "Вы указаны отправителем отправления"}</p>
        // <p>${client === "sender" ? `Адрес вручения: ${adressWhere}` : `Адрес забора: ${adressFrom}`}</p>
        // <p>За сутки до встречи с представителем, мы с вами свяжемся по номеру ${client === "sender" ? `+7${phoneWhere}` : `+7${phoneFrom}`}</p>
        // <p>Если вы не понимаете что за отправление, за подробностями можете обратиться по нашему номеру</p>
        // <div style="display:inline-block; text-decoration: none; border-radius:7px; margin:10px auto; background-color:#ff0d01; padding:10px 25px">
        //   <a style="font-weight:700; font-size:15px; margin:0 auto; color:white" href="tel:+79101056423">+7 910 105 64 23</a>
        // </div> 
        // </div> 
        //    `
        `
        <div style="font-size:15px"> 
          <p>Здраствуйте, ${nameFrom}!</p>
          <p>Вы указаны отправителем отправления</p>
          <p>Адрес забора: ${adressFrom}</p>
          <p>За сутки до встречи с представителем, мы с вами свяжемся по номеру +7${phoneFrom}</p>
          <p>Если вы не понимаете что за отправление, за подробностями можете обратиться по нашему номеру</p>
          <div style="display:inline-block; text-decoration: none; border-radius:7px; margin:10px auto; background-color:#ff0d01; padding:10px 25px">
            <a style="font-weight:700; font-size:15px; margin:0 auto; color:white" href="tel:+79101056423">+7 910 105 64 23</a>
          </div>
        </div>
        `,
        "KANTAR"
      );//нужно ли уведомлять отрпавителя о выбранных габаритах и весе(для соответствия)
    }
  }


  //отправка админу Кириллу
  await sendSMS("+79991386191",
    `Оформлена ЭКСПРЕСС ДОСТАВКА! 
${document === "document" ? "ДОКУМЕНТЫ" : "ГРУЗ"}. 

${adressFrom}
    ▼
${adressWhere}, 

Вес: ${isFinalHeft}, 
Цена: ${Math.ceil(price)}, 
Оформитель: +7${client === "sender" ? phoneFrom : phoneWhere} `);


  //отправка админу мне
  await sendSMS("+79030404804",
    `Оформлена ЭКСПРЕСС ДОСТАВКА! 
${document === "document" ? "ДОКУМЕНТЫ" : "ГРУЗ"}. 
    
${adressFrom}
    ▼
${adressWhere}, 

Вес: ${isFinalHeft}, 
Цена: ${Math.ceil(price)}, 
Оформитель: +7${client === "sender" ? phoneFrom : phoneWhere} `);


  //отправка клиенту
  await sendSMS(`+7${client === "sender" ? phoneFrom : phoneWhere}`,
    `Экспресс доставка оформлена. 
Ожидайте звонка сотрудника для подтверждения. 
Контактный номер телефона +79101056423`);

  return response;
  // return NextResponse.json({ success: true })
}
