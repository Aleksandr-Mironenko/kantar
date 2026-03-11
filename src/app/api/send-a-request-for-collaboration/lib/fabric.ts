"use server";
import { toCorrectUserAcc } from '@/app/components/DTO/DTO'

export default async function fabric(formData: FormData) {
  const correctFio = (stringFio: string): string => {
    const arrFio = stringFio.trim().split(/\s+/)
    let res = ''
    arrFio.forEach((el, index) => res += `${index > 0 ? " " : ""}${el[0].toUpperCase()}${el.slice(1).toLowerCase()}`)
    return res
  }


  const filesWithId: { id: number; file: File }[] = [];
  let id: string = "";
  let created_at: string = "";
  let agree: boolean = false;
  let client: 'ooo' | 'ip' | 'private' = 'private';
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
  let snils: string = "";

  for (const [key, value] of formData.entries()) {
    if (key === "client" && typeof value === "string") {
      if (value === "ooo") client = "ooo";
      else if (value === "ip") client = "ip";
      else if (value === "private") client = "private";
    }
  }

  const getOrCreateUserWhereData: toCorrectUserAcc = {
    id: null,
    created_at: null,
    email: null,
    phone: null,
    name: null,
    address_id: null,//надо изменить создав новый или получив старый
    is_client: false,  //раньше был true
    is_dogovor: false,
    type_acc: "request", //раньше был null
    ref_code: null,//поменять
    count_refcode_use: null,
    discount: null,
    passport: null,
    snils: null,
    fio_gd_OOO: null,
    name_OOO: null,
    oficial_adress_OOO: null,
    actual_address_OOO: null,
    inn_OOO: null,
    kpp_OOO: null,
    ogrn_OOO: null,
    rs_OOO: null,
    bic_OOO: null,
    corr_score_OOO: null,
    comment,
    fio_IP: null,
    actual_address_IP: null,
    inn_IP: null,
    ogrn_IP: null,
    rs_IP: null,
    bic_IP: null,
    corr_score_IP: null,
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
          client = "ooo"
        } else if (key === "id") {
          id = value
        } else if (key === "created_at") {
          created_at = value
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
        getOrCreateUserWhereData.created_at = created_at
        getOrCreateUserWhereData.id = id
        getOrCreateUserWhereData.email = email.toLowerCase()
        getOrCreateUserWhereData.phone = phone
        getOrCreateUserWhereData.name = name && name !== " " ? correctFio(name) : "Имя"
        getOrCreateUserWhereData.address_id = 56//надо изменить создав новый или получив старый но строго админу! 
        getOrCreateUserWhereData.is_client = true
        getOrCreateUserWhereData.is_dogovor = false
        getOrCreateUserWhereData.type_acc = "request" as const
        getOrCreateUserWhereData.ref_code = `${companyName}_referal#${56}`//поменять
        getOrCreateUserWhereData.count_refcode_use = 0
        getOrCreateUserWhereData.discount = 0
        getOrCreateUserWhereData.comment = comment
        getOrCreateUserWhereData.fio_gd_OOO = nameGD
        getOrCreateUserWhereData.name_OOO = companyName
        getOrCreateUserWhereData.oficial_adress_OOO = legalAddress
        getOrCreateUserWhereData.actual_address_OOO = realAddress
        getOrCreateUserWhereData.inn_OOO = innOoo
        getOrCreateUserWhereData.kpp_OOO = kpp
        getOrCreateUserWhereData.ogrn_OOO = ogrn
        getOrCreateUserWhereData.rs_OOO = rss
        getOrCreateUserWhereData.bic_OOO = bik
        getOrCreateUserWhereData.corr_score_OOO = kss
      }
      else if (client === "ip") {
        if (key === "client") {
          client = "ip"
        } else if (key === "name") {
          name = value
        } else if (key === "id") {
          id = value
        } else if (key === "created_at") {
          created_at = value
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

        getOrCreateUserWhereData.created_at = created_at
        getOrCreateUserWhereData.id = id
        getOrCreateUserWhereData.email = email.toLowerCase()
        getOrCreateUserWhereData.phone = phone
        getOrCreateUserWhereData.name = name && name !== " " ? correctFio(name) : "Имя"
        getOrCreateUserWhereData.address_id = 56//надо изменить создав новый или получив старый
        getOrCreateUserWhereData.is_client = true
        getOrCreateUserWhereData.is_dogovor = false
        getOrCreateUserWhereData.type_acc = "request" as const
        getOrCreateUserWhereData.ref_code = `${innip}_referal#${56}`//поменять
        getOrCreateUserWhereData.count_refcode_use = 0
        getOrCreateUserWhereData.discount = 0
        getOrCreateUserWhereData.comment = comment
        getOrCreateUserWhereData.fio_IP = ipName
        getOrCreateUserWhereData.actual_address_IP = realAddressIp
        getOrCreateUserWhereData.inn_IP = innip
        getOrCreateUserWhereData.ogrn_IP = ogrnip
        getOrCreateUserWhereData.rs_IP = rss
        getOrCreateUserWhereData.bic_IP = bik
        getOrCreateUserWhereData.corr_score_IP = kss
      }
      else if (client === "private") {
        if (key === "ooo") {
          client = "ooo"
        } else if (key === "name") {
          name = value
        } else if (key === "id") {
          id = value
        } else if (key === "created_at") {
          created_at = value
        } else if (key === "phone") {
          phone = value
        } else if (key === "email") {
          email = value
        } else if (key === "comment") {
          comment = value
        } else if (key === "passport") {
          passport = value
        } else if (key === "snils") {
          snils = value
        }
      }

      getOrCreateUserWhereData.created_at = created_at
      getOrCreateUserWhereData.id = id
      getOrCreateUserWhereData.email = email.toLowerCase()
      getOrCreateUserWhereData.phone = phone
      getOrCreateUserWhereData.name = name && name !== " " ? correctFio(name) : "Имя"
      getOrCreateUserWhereData.address_id = 56//надо изменить создав новый или получив старый
      getOrCreateUserWhereData.is_client = true
      getOrCreateUserWhereData.is_dogovor = false
      getOrCreateUserWhereData.type_acc = "request" as const
      getOrCreateUserWhereData.ref_code = `${email}_referal#${56}`//поменять
      getOrCreateUserWhereData.count_refcode_use = 0
      getOrCreateUserWhereData.discount = 0
      getOrCreateUserWhereData.comment = comment
      getOrCreateUserWhereData.passport = passport
      getOrCreateUserWhereData.snils = snils
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
        <p>СНИЛС: ${snils}</p>
         `) : ""
  )

  const bodyTextMessageUser = `
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
   `

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

  let messageAdminSMS: string = ""

  if (client === "ooo") {
    messageAdminSMS = `(ООО)
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
    messageAdminSMS = `(ИП)
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
    messageAdminSMS = `
Частное лицо

ФИО: ${name},

Паспорт: ${passport},

СНИЛС: ${snils},

Телефон: ${phone},

Почта: ${email},

Комментарий:
${comment}
    `
  }

  const messageUserSMS = `Запрос на подписание договора отправлен.
Ожидайте звонка сотрудника. 
Контактный номер телефона +79101056423`


  const normalizedPhone =
    phone.replace(/\D/g, '')
      .replace(/^8/, '7')
      .replace(/^7/, '+7')

  console.log(getOrCreateUserWhereData)

  return { getOrCreateUserWhereData, agree, phone: normalizedPhone, email, fileArray, sms: { messageUserSMS, messageAdminSMS }, emailMessage: { bodyTextMessageUser, bodyTextMessage } }
}


