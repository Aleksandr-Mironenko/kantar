import { useState, useEffect } from 'react'
import { TableOrdersRecord } from "../DTO/DTO";
import { Flex, QRCode } from 'antd';
import type { QRCodeProps } from 'antd';
import { createStyles } from 'antd-style';


const useStyles = createStyles(() => ({
  root: {
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: 16,
  },
}));


const stylesFunction: QRCodeProps['styles'] = (info) => {
  if (info.props.type === 'canvas') {
    return {
      root: {
        border: '2px solid #ff0d01',
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'rgba(255, 13, 1, 0.1)',
      },
    } satisfies QRCodeProps['styles'];
  }
};


type PleaseInServer = {
  fullPrice: number,
  heft: number,
  height: number,
  id: number,
  length: number,
  nds: number,
  order_id: string,
  order_number: number,
  places_personal_id: string,
  price: number,
  volume: number,
  width: number,
  status_place: "confirmed" | "changes_have_been_made" | "client_responsibility" | "canceled",
  sumPlaces: number
}

interface AddressInServer {
  id: number,
  full_address: string,
  country_name: string,
  country_zone: string,
  country_id: 0,
  city_name: string,
  city_zone: string,
  city_id_rf: number,
  city_id_foreign: number,
  city_zone_id: number,
  index: string
}

type Type_acc = "noAcc" | "request" | "private" | "OOO" | "IP";

interface UserInServer {
  id: string,
  email: string,
  phone: string,
  name: string,
  address_id: number,
  is_client: boolean,
  is_dogovor: boolean,
  type_acc: Type_acc,
  ref_code: string,
  created_at: string,
  discount: number,
}



const Order = ({ numberOrder }: { numberOrder: number }) => {
  const { styles: classNames } = useStyles();

  const sharedProps: QRCodeProps = {
    value: 'https://kanta-i60yzketp-aleksandrs-projects-45823929.vercel.app/#calculator_express',
    size: 140,
    classNames,
  };

  const [place, setPlace] = useState<PleaseInServer[]>([])
  const [files, setFiles] = useState<string[]>([]);
  const [dataAddressInIdSendler, setDataAddressInIdSendler] = useState<AddressInServer>({
    id: 0,
    full_address: "",
    country_name: "",
    country_zone: "",
    country_id: 0,
    city_name: "",
    city_zone: "",
    city_id_rf: 0,
    city_id_foreign: 0,
    city_zone_id: 0,
    index: ""
  })
  const [dataAddressInIRecipient, setDataAddressInIRecipient] = useState<AddressInServer>({
    id: 0,
    full_address: "",
    country_name: "",
    country_zone: "",
    country_id: 0,
    city_name: "",
    city_zone: "",
    city_id_rf: 0,
    city_id_foreign: 0,
    city_zone_id: 0,
    index: ""
  })
  const [userSendler, setUserSendler] = useState<UserInServer>({
    id: "",
    email: "",
    phone: "",
    name: "",
    address_id: 0,
    is_client: false,
    is_dogovor: false,
    type_acc: "noAcc",
    ref_code: "",
    created_at: "",
    discount: 0
  })

  const [userRecipient, setUserRecipient] = useState<UserInServer>({
    id: "",
    email: "",
    phone: "",
    name: "",
    address_id: 0,
    is_client: false,
    is_dogovor: false,
    type_acc: "noAcc",
    ref_code: "",
    created_at: "",
    discount: 0
  })
  const [addressSendler, setAddressSendler,] = useState<AddressInServer>({
    id: 0,
    full_address: "",
    country_name: "",
    country_zone: "",
    country_id: 0,
    city_name: "",
    city_zone: "",
    city_id_rf: 0,
    city_id_foreign: 0,
    city_zone_id: 0,
    index: ""
  })

  const [addressRecipient, setAddressRecipient] = useState<AddressInServer>({
    id: 0,
    full_address: "",
    country_name: "",
    country_zone: "",
    country_id: 0,
    city_name: "",
    city_zone: "",
    city_id_rf: 0,
    city_id_foreign: 0,
    city_zone_id: 0,
    index: ""
  })

  const [order, setOrder] = useState<TableOrdersRecord>(
    {
      id: 0,
      order_number: 0,
      created_at: "",
      sender_id: 0,
      recipient_id: 0,
      address_from_id: 0,
      address_where_id: 0,
      name_from: '',
      name_where: '',
      phone_from: '',
      phone_where: '',
      email_from: '',
      email_where: '',
      discount_this_send: 0,
      price_full: 0,
      is_paid: false,
      heft_full: 0,
      status: "new",
      is_individual: false,
    }
  )


  const getPlaces = async (numberOrder: number) => {
    const request = await fetch("/api/admin/admin-panel-poling/orders/search-one-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numberOrder
      })
    })

    if (!request.ok) {
      throw new Error("Ошибка получения мест")
    }

    const response = await request.json();
    setOrder(response.dataOrder)
    setFiles(response.arrrfiles)
    setPlace(response.arrayPlacesInOrder)
    setUserSendler(response.dataUserSendler)
    setUserRecipient(response.dataUserRecipient)
    setAddressSendler(response.dataAddressSendler)
    setAddressRecipient(response.dataAddressRecipient)
    setDataAddressInIdSendler(response.dataAddressInIdSendler)
    setDataAddressInIRecipient(response.dataAddressInIRecipient)
  }



  console.log(userSendler,
    userRecipient,
    addressSendler,
    addressRecipient)



  useEffect(() => {
    if (!numberOrder) return;

    getPlaces(numberOrder)

  }, [numberOrder]);











  function getFileType(path: string) {
    const cleanPath = path.split('?')[0];
    const ext = cleanPath.split('.').pop()?.toLowerCase();

    if (!ext) return 'unknown';

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (['xls', 'xlsx'].includes(ext)) return 'xls';

    return 'text';
  }


  // fullPrice
  // heft 
  // height 
  // id
  // length
  // nds
  // order
  // id
  // order_number
  // places_personal_id
  // price
  // volume width 


  const dateCreateOrder = (date: string) => {
    const qweqwe = new Date(date).toLocaleString()
    const aaa = qweqwe.split(",")
    const bbb = aaa[0].split(".")
    return `${bbb[0]}.${bbb[1]}.${bbb[2]} в ${aaa[1]} `
  }


  const status = order.status === "new" ? "новый" :
    order.status === "pickup_required_(processed)" ? "требуется забор (обработано)" :
      order.status === "awaiting_payment_(shipped)" ? "ожидает оплаты(отправлен)" :
        order.status === "awaiting_payment_(not_shipped)" ? "ожидает оплаты(не отправлен)" :
          order.status === "in_transit" ? "в пути" :
            order.status === "delivery_pending" ? "согласовываем вручение" :
              order.status === "in_transit_(delivery)" ? "в пути (вручение)" :
                order.status === "delivered" ? "вручено" :
                  order.status === "canceled" ? "отменено" :
                    order.status === "archived" ? "архивный" : ""




  // type Place = typeof place[number]; //сомнительный момент

  // type PlaceWithCount = Place & {
  //   count: number;
  // };

  // const transformPlaces = (places: Place[]): PlaceWithCount[] => {
  //   const map = new Map<string, Place[]>();

  //   // Группировка одинаковых мест
  //   for (const el of places) {
  //     const key = `${el.heft}_${el.width}_${el.length}_${el.volume}`;

  //     if (!map.has(key)) {
  //       map.set(key, []);
  //     }

  //     map.get(key)!.push(el);
  //   }

  //   const result: PlaceWithCount[] = [];

  //   // Разбиение по sumPlaces
  //   for (const group of map.values()) {
  //     const limit = group[0].sumPlaces; // есть в каждой записи
  //     let remaining = group.length;

  //     while (remaining > 0) {
  //       const count = Math.min(limit, remaining);

  //       result.push({
  //         ...group[0],
  //         count,
  //       });

  //       remaining -= count;
  //     }
  //   }

  //   return result;
  // };


  // const mapPlaces = transformPlaces(place).map(el => {
  //   return (
  //     <li key={el.id} style={{ marginBottom: "10px", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>
  //       <div>

  //         <p> Номер заказа: {el.order_number}</p>
  //         <p>{new Date(order.created_at).toLocaleString()}</p>
  //         <p> Вес: {el.heft}</p>
  //         <p> Высота: {el.height}</p>
  //         <p> Номер места: {el.id}</p>
  //         <p> Длина: {el.length}</p>
  //         <p> НДС: {el.nds}</p>
  //         <p> id заказа: {el.order_id}</p>
  //         <p> Персональный id места: {el.places_personal_id}</p>

  //         <p> Объем: {el.volume}</p>
  //         <p> Ширина: {el.width}</p>
  //         <div style={{ display: "flex", justifyContent: "space-between" }}>
  //           <span> Стоимость места: {el.price} </span>  <span>аналогичных мест {el.sumPlaces}</span>
  //         </div>
  //       </div>
  //     </li>
  //   )
  // }
  // )

  // const markerInPlase = (value: string): string => {
  //   const arr = value.split("_")
  //   const arrTosSring = arr.splice(1, 1).join("_")
  //   return arrTosSring

  // }


  const mapPlaces = place.map(el => {
    const statusEl = el.status_place === "client_responsibility" ? "не проверен" :
      el.status_place === "confirmed" ? "подтвержден" :
        el.status_place === "changes_have_been_made" ? "были внесены изменения" :
          el.status_place === "canceled" ? "отменен" : ""




    const personalMarker = `${el.places_personal_id} (место: ${el.id})`


    return (
      <li key={el.id} style={{ marginTop: "10px", display: "flex", marginBottom: "10px", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>
        <div style={{ width: "90%", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "28px", alignSelf: "center" }}>{personalMarker}</p>
          <p> Проверка фактических характеристик: {statusEl}</p>
          <p> Номер места: {el.id}</p>
          {/* <p>{new Date(order.created_at).toLocaleString()}</p> */}

          {/* <p> id заказа: {el.order_id}</p> */}

          <div style={{}}>
            <p> Условная стоимость места: {Math.ceil(el.price / el.sumPlaces)} р. </p>
            {el.nds > 0 && <p> Условный НДС: {Math.ceil(el.nds / el.sumPlaces)} p.</p>}
          </div>


          <div style={{ alignSelf: "flex-end" }}>
            <p> Длина: {el.length} см.</p>
            <p> Ширина: {el.width} см.</p>
            <p> Высота: {el.height} см.</p>
            <p> Вес: {el.heft} кг.</p>
            <p> Объем: {el.volume} </p>
          </div>


        </div>
      </li>
    )
  }
  )









  const mapfiles = Array.isArray(files)
    ? files.map((el, index) => {
      const type = getFileType(el);
      return (
        <li key={el}  >
          {type === 'image' ? (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              {/* <Image  //возможность просмотра
                  src={el}
                  alt=""
                  width={1300}
                  height={1200}
                  style={{ objectFit: 'contain' }}
                /> */}
              <a
                href={el}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {index + 1}. ИЗОБРАЖЕНИЕ скачать
              </a>
            </div>

          ) : //type === 'pdf' ? (  //возможность просмотра
            //   <div style={{ display: "flex", flexDirection: "row" }}>
            //     {/* добавить hover */}
            //     <iframe
            //       src={el}
            //       width="100%"
            //       height="600"
            //     />
            //     <p>пдф</p>
            //   </div>
            // ) 
            type === 'pdf' ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <a
                  href={el}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {index + 1}. ФАЙЛ PDF смотреть
                </a>
              </div>)
              :
              type === 'doc' ? (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {/* добавить hover */}
                  <a
                    href={el}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    {index + 1}. ФАЙЛ DOC скачать
                  </a>
                </div>

              ) :
                type === 'xls' ? (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {/* добавить hover */}
                    <a
                      href={el}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {index + 1}. ФАЙЛ XLS скачать
                    </a>
                  </div>

                ) : (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {/* добавить hover */}
                    <a
                      href={el}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {index + 1}. ФАЙЛ (неопределенный тип) скачать
                    </a>
                  </div>
                )
          }
        </li >
      );
    })
    : null;



  const typeAcc = (type: string): string => {
    return type === "noAcc" ? "Без договора" :
      type === "request" ? "Запрос на подписание договора" :
        type === "private" ? "Есть договор (частное лицо)" :
          type === "OOO" ? "Есть договор (ООО)" :
            type === "IP" ? "Есть договор (ИП)" : ""
  }


  const yandexMapsLink = (adsress: string) => {
    return `https://yandex.ru/maps/?text=${encodeURIComponent(
      [adsress]
        .filter(Boolean)
        .join(", ")
    )}`;
  }

  const mapOrder = (
    <div key={order.id} style={{ display: "flex" }}>
      <div style={{ width: "100%", }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "28px" }}> Номер заказа: {order.order_number}</p>
          <Flex gap="middle" style={{ position: "absolute", top: "0px", right: "0px" }}>
            <QRCode
              {...sharedProps}
              type="canvas"
              icon="https://cdn.iconscout.com/icon/premium/png-512-thumb/gps-arrow-icon-svg-download-png-6291895.png?f=webp&w=512"
              styles={stylesFunction}
            />
          </Flex>




        </div><p> Статус заказа: {status} </p>
        <p> Был создан: {dateCreateOrder(order.created_at)}</p>
        <p> Полный рассчетный вес: {order.heft_full}</p>
        <p> Полная стоимость: {order.price_full}   <span style={{ color: "red" }}>{order.is_individual ? "Индивидуальный рассчет" : "Фиксированная цена(экспресс)"}</span></p>
        <p> Индивидуальная скидка (заказа): {order.discount_this_send}</p>
        <p> Поступление оплаты: {order.is_paid === true ? "Оплачен" : "Не оплачен"}</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: "10px", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>
          <p style={{ fontSize: "28px", alignSelf: "center" }}>Данные отправителя</p>
          <p>ФИО: {userSendler.name}</p>
          <p style={{}}>
            Телефон:
            <b>
              <a style={{ fontSize: "15px", padding: "7px" }}
                href={`tel:${userSendler.phone}`} >
                {userSendler.phone}
              </a>
            </b>
          </p>
          <p style={{ marginBottom: "0" }}>
            Эл. почта:
            <b>
              <a
                style={{ fontSize: "15px", padding: "7px" }}
                href={`mailto:${userSendler.email}`}
              >
                {userRecipient.email}
              </a>
            </b>
          </p>
          <a
            href={`${yandexMapsLink(dataAddressInIdSendler.full_address)}`}
            style={{ margin: "15px", background: "#e31e24", color: "white", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", display: "inline-block" }}
            target="_blank">
            {dataAddressInIdSendler.full_address} на Яндекс.Картах
          </a>

          {/* <p>{userSendler.created_at}</p>  */}
          {/*уже известно когда созданы места*/}
          <p>Персональная скидка клиента: {userSendler.discount}</p>
          {/* <p>{userSendler.id}</p> */}{/*айдишник клиента*/}
          <p>Делал заказы: {userSendler.is_client ? "да" : "нет"}</p>{/* логика смены */}
          <p>Наличие договора: {typeAcc(userSendler.type_acc)}</p>
          <p>Реферальный код: {userSendler.ref_code ? userSendler.ref_code : "не задан"}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>
          <p style={{ fontSize: "28px", alignSelf: "center" }}>Данные получателя</p>
          <p>ФИО: {userRecipient.name}</p>
          <p style={{}}>
            Телефон:
            <b>
              <a style={{ fontSize: "15px", padding: "7px" }} href={`tel:${userRecipient.phone}`} >
                {userRecipient.phone}
              </a>
            </b>
          </p>
          <p style={{ marginBottom: "0" }}>
            Эл. почта:
            <b>
              <a
                style={{ fontSize: "15px", padding: "7px" }}
                href={`mailto:${userRecipient.email}`}
              >
                {userRecipient.email}
              </a>
            </b>
          </p>
          <a
            href={`${yandexMapsLink(dataAddressInIRecipient.full_address)}`}
            style={{ margin: "15px", background: "#e31e24", color: "white", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", display: "inline-block" }}
            target="_blank">
            {dataAddressInIRecipient.full_address} на Яндекс.Картах
          </a>
          {/* <p>{userSendler.created_at}</p>  */}
          {/*уже известно когда созданы места*/}
          <p>Персональная скидка клиента: {userRecipient.discount}</p>
          {/* <p>{userSendler.id}</p> */}{/*айдишник клиента*/}
          <p>Делал заказы: {userRecipient.is_client ? "да" : "нет"}</p>{/* логика смены */}
          <p>Наличие договора: {typeAcc(userRecipient.type_acc)}</p>
          <p>Реферальный код: {userRecipient.ref_code ? userSendler.ref_code : "не задан"}</p>
          <p>{typeAcc(userRecipient.type_acc)}</p>
        </div>

        <div>

          <ol style={{ listStyleType: "none" }}>
            {mapPlaces}
          </ol>
        </div>
        {files.length > 0 ? <div style={{ display: "inline-block", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>
          <p>Клиент прикрепил файлы:</p>
          <ol style={{ listStyleType: "none", marginTop: "30px" }}>
            {mapfiles}
          </ol>
        </div> : null}

        {/* {order.1} */}



      </div>
    </div >
  )





  return (
    <div style={{ backgroundColor: "white", width: "90%", margin: "200px 10%", padding: "35px", borderRadius: "20px" }}>
      {mapOrder}
    </div>
  )
}
export default Order