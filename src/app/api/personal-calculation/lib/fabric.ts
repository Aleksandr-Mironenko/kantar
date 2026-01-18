"use server";


export default async function fabric(formData: FormData) {


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

  const fileArray = filesWithId.map(f => f.file)

  const now = new Date();
  const validTime = (): string => {
    const min: number = now.getMinutes();
    const minutes = min < 10 ? `0${min}` : String(min)
    const h: number = now.getHours();
    const hours = h < 10 ? `0${h}` : String(h)
    return `${hours}:${minutes}`
  }
  const createTime = validTime()

  const bodyTextMessage = `<p>Новый запрос на рассчет стоимости отправки (не экспресс) ${createTime}  
        <p>Запрос поступил от ${name}</p>
        <p>Контактный номер ${phone} </p>
        <p>Эл. почта ${email}</p>
        <p>Важное для клиента: ${comment}</p>
        `

  const bodyTextMessageUser =
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
   `

  const messageAdminSMS: string = `Оформлена заявка 
  на ПЕРСОНАЛЬНЫЙ РАССЧЕТ! 
  ФИО: ${name},
  Телефон: ${phone},
  Почта: ${email},
  Комментарий: ${comment}`


  const messageUserSMS = `Запрос на персональный рассчет отправлен. 
  Ожидайте звонка сотрудника. 
  Контактный номер телефона +79101056423`



  const normalizedPhone =
    phone.replace(/\D/g, '')
      .replace(/^8/, '7')
      .replace(/^7/, '+7')

  console.log(messageUserSMS, 93)

  console.log(messageAdminSMS, 95)

  return { agree, phone: normalizedPhone, email, fileArray, sms: { messageUserSMS, messageAdminSMS }, emailMessage: { bodyTextMessageUser, bodyTextMessage } }
}