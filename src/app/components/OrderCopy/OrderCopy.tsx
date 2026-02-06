"use client"
import { useState, useEffect } from 'react'
import { TableOrdersRecord, FileObj } from "../DTO/DTO";
import { Flex, QRCode } from 'antd';
import type { QRCodeProps } from 'antd';
import { createStyles } from 'antd-style';
import { PDFWayBillClient, UserInServer, PleaseInServer, AddressInServer } from "../DTO/DTO";
import styles from './OrderCopy.module.scss'
import DownloadFile from "../Helpers/DownloadFile"

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


const OrderCopy = ({ numberOrder }: { numberOrder: number }) => {
  const { styles: classNames } = useStyles();

  const sharedProps: QRCodeProps = {
    value: 'https://kanta-i60yzketp-aleksandrs-projects-45823929.vercel.app/#calculator_express',
    size: 140,
    classNames,
  };

  const [place, setPlace] = useState<PleaseInServer[]>([])
  const [files, setFiles] = useState<string[]>([]);
  const [filesSender, setFilesSender] = useState<string[]>([]);
  const [filesRecipient, setFilesRecipient] = useState<string[]>([]);


  const [filesOrder, setFilesOrder] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showFilesOrder, setShowFilesOrder] = useState<boolean>(false) //открыты ли файлы флаг

  const [filesUserSender, setFilesUserSender] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showFilesUserSender, setShowFilesUserSender] = useState<boolean>(false) //открыты ли файлы флаг

  const [filesUserRecipient, setFilesUserRecipient] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showFilesUserRecipient, setShowFilesUserRecipient] = useState<boolean>(false) //открыты ли файлы флаг

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
  // const [addressSendler, setaddressSendler] = useState<AddressInServer>({
  //   id: 0,
  //   full_address: "",
  //   country_name: "",
  //   country_zone: "",
  //   country_id: 0,
  //   city_name: "",
  //   city_zone: "",
  //   city_id_rf: 0,
  //   city_id_foreign: 0,
  //   city_zone_id: 0,
  //   index: ""
  // })
  // const [addressRecipient, setAddressRecipient] = useState<AddressInServer>({
  //   id: 0,
  //   full_address: "",
  //   country_name: "",
  //   country_zone: "",
  //   country_id: 0,
  //   city_name: "",
  //   city_zone: "",
  //   city_id_rf: 0,
  //   city_id_foreign: 0,
  //   city_zone_id: 0,
  //   index: ""
  // })

  const [order, setOrder] = useState<TableOrdersRecord>(
    {
      id: '',
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
      document: "document",
      loading_date: null,
      unloading_date: null,
      heft_only_full: 0,
      volume_only_full: 0,
      sender_type_acc: 'noAcc',
      recipient_type_acc: 'noAcc',
      sender_name: "",
      recipient_name: "",
      sender_name_OOO: "",
      sender_fio_gd_OOO: "",
      sender_fio_IP: "",
      recipient_name_OOO: "",
      recipient_fio_gd_OOO: "",
      recipient_fio_IP: "",
      sender_country_name: "",
      recipient_country_name: "",
      sender_city_name: "",
      recipient_city_name: "",
      isSender: "sender",
      product: "express-RF"
    }
  )

  const [openDataSendler, setOpenDataSendler] = useState<boolean>(false)
  const [openDataRecipient, setOpenDataRecipient] = useState<boolean>(false)

  const [openOrderFiles, setOpenOrderFiles] = useState<boolean>(false)
  const [openOrderFilesSender, setOpenOrderFilesSender] = useState<boolean>(false)
  const [openOrderFilesRecipient, setOpenOrderFilesRecipient] = useState<boolean>(false)



  const [addFileInOrder, setAddFileInOrder] = useState<boolean>(false)
  const [addFileInSendler, setAddFileInSendler] = useState<boolean>(false)
  const [addFileInRecipient, setAddFileInRecipient] = useState<boolean>(false)
  const [openOrderPlaces, setOpenOrderPlaces] = useState<boolean>(false)


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
    setFilesSender(response.filesSendler)
    setFilesRecipient(response.filesRecipient)
  }



  const createPDFWaybill = async (data: PDFWayBillClient) => {
    const request = await fetch("/api/admin/admin-panel-poling/orders/PDFDocumentWaybillLoad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data
      })
    })

    if (!request.ok) {
      throw new Error("Ошибка создания PDF")
    }

    console.log("pdf создан")

    getPlaces(numberOrder)
  }




  useEffect(() => {
    if (!numberOrder) return;

    getPlaces(numberOrder)

  }, [numberOrder]);











  function getFileType(path: string) {
    const cleanPath = path.split('?')[0];
    const ext = cleanPath.split('.').pop()?.toLowerCase();
    const waybill = cleanPath.split('-').at(-2)?.toLowerCase();
    if (!ext) return 'unknown';

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return 'image'
    }
    else if (waybill === "waybill" && ext === 'pdf') {
      return 'waybill'
    }
    else if (ext === 'pdf') {
      return 'pdf'
    }
    else if (['doc', 'docx'].includes(ext)) {
      return 'doc'
    }
    else if (['xls', 'xlsx'].includes(ext)) {
      return 'xls'
    };
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




  const mapFilesSender = Array.isArray(filesSender) ?
    filesSender.map((el, index) => {
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
            type === 'waybill' ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <a
                  href={el}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {index + 1}. waybill.pdf смотреть
                </a>
              </div>)
              :
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

  const mapFilesRecipient = Array.isArray(filesRecipient) ?
    filesRecipient.map((el, index) => {
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
            type === 'waybill' ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <a
                  href={el}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {index + 1}. waybill.pdf смотреть
                </a>
              </div>)
              :
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
            type === 'waybill' ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <a
                  href={el}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {index + 1}. waybill.pdf смотреть
                </a>
              </div>)
              :
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

  const place_volume_total_heft = place.reduce((acc, el) =>
    acc += el.volume
    , 0)

  const place_total_heft = place.reduce((acc, el) =>
    acc += el.heft
    , 0)

  const stringNumbersPlaces = place
    .map(el => el.id)
    .join(', ')


  // const numbersOnly = Number(String(order.id).replace(/\D/g, ''));
  console.log(order.product)
  const propsPGF = {
    order_number: order.order_number,
    date_create_at: dateCreateOrder(order.created_at),
    from_name: userSendler.name,
    from_full_adress: addressSendler.full_address,
    from_city: addressSendler.city_name,
    from_country: addressSendler.country_name,
    where_name: userRecipient.name,
    where_full_adress: addressRecipient.full_address,
    where_sity: addressRecipient.city_name,
    where_counter: addressRecipient.country_name,//назвал поле неправильно подразумевал страну получения
    // from_code: `${addressSendler.country_zone}${addressSendler.city_zone ? ` ⯈  ${addressSendler.city_zone}` : ""}`,
    // where_code: `${addressRecipient.country_zone}${addressRecipient.city_zone ? ` ⯈  ${addressRecipient.city_zone}` : ""}`,
    array_services: "Список доп услуг 111111111111 11111111111 111111111 111111111 11111111 11111111 1111111111111111111",
    saved_price: "Страховка груза 1 Р",
    volume_total_heft: place_volume_total_heft,
    total_heft: place_total_heft,
    sum_places: place?.[0]?.sumPlaces ?? 1,
    array_numbers_places: stringNumbersPlaces,
    from_phone: userSendler.phone,
    where_phone: userRecipient.phone,
    product: order.product,
    payment: order.is_paid,
    shipping_invoice: "номер счета",
    sender_markse: "комментарий",
    content: order.document === "document" ? "документы" : "груз",
    order_id: order.id
  }
  const onSubmit = async () => {

    const formData = new FormData();
    filesOrder.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });
    formData.append("orderId", String(order.id))       // число заказа из state
    formData.append("orderNumber", String(order.order_number)); // номер заказа

    const response = await fetch("/api/admin/admin-actions/addFilesInOrder", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")
    }

    getPlaces(numberOrder)
    setAddFileInOrder(false)
  };



  const onSubmitUserSender = async () => {

    const formData = new FormData();
    filesOrder.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });
    formData.append("orderId", String(order.id))       // число заказа из state
    formData.append("orderNumber", String(order.order_number)); // номер заказа

    const response = await fetch("/api/admin/admin-actions/addFilesInOrder", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")
    }
    getPlaces(numberOrder)
    setAddFileInSendler(false)

  };



  const onSubmitUserRecipient = async () => {

    const formData = new FormData();
    filesOrder.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });
    formData.append("orderId", String(order.id))       // число заказа из state
    formData.append("orderNumber", String(order.order_number)); // номер заказа

    const response = await fetch("/api/admin/admin-actions/addFilesInOrder", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")
    }

    getPlaces(numberOrder)
    setAddFileInRecipient(false)
  };


  const senderData = openDataSendler && (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>
      <div
        onClick={() => setOpenDataSendler(false)}
        className={styles.closeButton} >
        ×
      </div>
      <p style={{ fontSize: "28px", alignSelf: "center" }}>Данные отправителя</p>
      <p>ФИО: {userSendler.name}</p>
      <p  >
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
        href={`${yandexMapsLink(addressSendler.full_address)}`}
        style={{ margin: "15px 0", background: "#e31e24", color: "white", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", display: "inline-block" }}
        target="_blank">
        НА КАРТЕ: {addressSendler.full_address}
      </a>

      {/* <p>{userSendler.created_at}</p>  */}
      {/*уже известно когда созданы места*/}
      <p>Персональная скидка клиента: {userSendler.discount}</p>
      {/* <p>{userSendler.id}</p> */}{/*айдишник клиента*/}
      <p>Делал заказы: {userSendler.is_client ? "да" : "нет"}</p>{/* логика смены */}
      <p>Наличие договора: {typeAcc(userSendler.type_acc)}</p>
      {userSendler.type_acc !== "noAcc" && userSendler.type_acc !== "request" && <p>Реферальный код: {userSendler.ref_code ? userSendler.ref_code : "не задан"}</p>}

      {openOrderFilesSender
        ?
        <div style={{ display: "inline-block", padding: "10px", border: "2px solid black ", borderRadius: "10px", position: "relative" }}>
          <div
            onClick={() => setOpenOrderFilesSender(false)}
            className={styles.closeButton} >
            ×
          </div>
          <p>Файлы отправителя:</p>
          <ol style={{ listStyleType: "none", marginTop: "30px" }}>
            {mapFilesSender}
          </ol>





          {addFileInSendler ?
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setAddFileInSendler(false)}
                className={styles.closeButton} style={{ color: "red", zIndex: '100', fontSize: "10px", right: "-7px", top: "5px" }} >
                отмена
              </div>

              <DownloadFile invoiceFiles={filesUserSender}
                setInvoiceFiles={setFilesUserSender}
                showInvois={showFilesUserSender}
                setShowInvois={setShowFilesUserSender}

                isOrder={false}
                isUserSender={true}
                isUserRecipient={false} />
              <button style={{ border: "none", backgroundColor: "white", padding: "10px 0", marginTop: "10px", fontSize: "35px", position: "absolute", right: "-10px", top: "7px" }} onClick={() => onSubmit()}>❱❱❱</button>
            </div>
            :
            <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }} onClick={() => setAddFileInSendler(true)}>Добавить файл</button>
          }
        </div>
        : <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
          onClick={(e) => {
            e.preventDefault()
            setOpenOrderFilesSender(true)
          }}>Открыть файлы отправителя</button>
      }
    </div>)

  const recipientData = openDataRecipient && (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>

      <div
        onClick={() => setOpenDataRecipient(false)}
        className={styles.closeButton} >
        ×
      </div>
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
        href={`${yandexMapsLink(addressRecipient.full_address)}`}
        style={{ margin: "15px 0", background: "#e31e24", color: "white", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", display: "inline-block" }}
        target="_blank">
        НА КАРТЕ: {addressRecipient.full_address}
      </a>
      {/* <p>{userSendler.created_at}</p>  */}
      {/*уже известно когда созданы места*/}
      <p>Персональная скидка клиента: {userRecipient.discount}</p>
      {/* <p>{userSendler.id}</p> */}{/*айдишник клиента*/}
      <p>Делал заказы: {userRecipient.is_client ? "да" : "нет"}</p>{/* логика смены */}
      <p>Наличие договора: {typeAcc(userRecipient.type_acc)}</p>
      {userSendler.type_acc !== "noAcc" && userSendler.type_acc !== "request" && <p>Реферальный код: {userRecipient.ref_code ? userSendler.ref_code : "не задан"}</p>}


      {openOrderFilesRecipient
        ?
        <div style={{ display: "inline-block", padding: "10px", border: "2px solid black ", borderRadius: "10px", position: "relative" }}>
          <div
            onClick={() => setOpenOrderFilesRecipient(false)}
            className={styles.closeButton} >
            ×
          </div> {/*вернуться */}
          <p>Файлы получателя:</p>
          <ol style={{ listStyleType: "none", marginTop: "30px" }}>
            {mapFilesRecipient}
          </ol>
          {<div style={{ position: "relative" }}>
            {addFileInRecipient ?
              <div style={{ position: "relative" }}>

                <div
                  onClick={() => setAddFileInRecipient(false)}
                  className={styles.closeButton} style={{ color: "red", zIndex: '100', fontSize: "10px", right: "-7px", top: "5px" }} >
                  отмена
                </div>
                <DownloadFile invoiceFiles={filesUserRecipient}
                  setInvoiceFiles={setFilesUserRecipient}
                  showInvois={showFilesUserRecipient}
                  setShowInvois={setShowFilesUserRecipient}
                  isOrder={false}
                  isUserSender={false}
                  isUserRecipient={true} />

                <button style={{ border: "none", backgroundColor: "white", padding: "10px 0", marginTop: "10px", fontSize: "35px", position: "absolute", right: "-10px", top: "7px" }} onClick={() => onSubmit()}>❱❱❱</button>
              </div>
              :
              <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }} onClick={() => setAddFileInRecipient(true)}>Добавить файл</button>
            }
          </div>}
        </div> : <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
          onClick={(e) => {
            e.preventDefault()
            setOpenOrderFilesRecipient(true)
          }}>Открыть файлы получателя</button>
      }
    </div >)



  const mapOrder = (
    <div key={order.id} style={{ display: "flex" }}>
      <div style={{ width: "100%", }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <h2 style={{ fontSize: "28px" }}> Номер заказа: {order.order_number}</h2>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", position: "absolute", top: "0px", right: "0px" }}>
            <Flex gap="middle"  >
              <QRCode
                {...sharedProps}
                type="canvas"
                icon="https://cdn.iconscout.com/icon/premium/png-512-thumb/gps-arrow-icon-svg-download-png-6291895.png?f=webp&w=512"
                styles={stylesFunction}
              />
            </Flex>
            <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
              onClick={(e) => {
                e.preventDefault()
                createPDFWaybill(propsPGF)
              }}>Создать waybill</button>

            {!openDataSendler && <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
              onClick={(e) => {
                e.preventDefault()
                setOpenDataSendler(true)

              }}>Открыть отправителя</button>}
            {!openDataRecipient &&
              <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
                onClick={(e) => {
                  e.preventDefault()
                  setOpenDataRecipient(true)
                }}>Открыть получателя</button>}
            {!openOrderFiles && <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
              onClick={(e) => {
                e.preventDefault()
                setOpenOrderFiles(true)
              }}>Открыть файлы заказа</button>}

            {!openOrderPlaces && <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
              onClick={(e) => {
                e.preventDefault()
                setOpenOrderPlaces(true)
              }}>Открыть места заказа</button>}
          </div>




        </div>
        <p> Статус заказа: {status} </p>
        <p> Был создан: {order.created_at ? dateCreateOrder(order.created_at) : ""}</p>
        <p> Полный рассчетный вес: {order.heft_full}</p>
        <p> Полная стоимость: {order.price_full}   <span style={{ color: "red" }}>{order.is_individual ? "Индивидуальный рассчет" : "Фиксированная цена(экспресс)"}</span></p>
        <p> Индивидуальная скидка (заказа): {order.discount_this_send}</p>
        <p> Поступление оплаты: {order.is_paid === true ? "Оплачен" : "Не оплачен"}</p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
          {senderData}
          {recipientData}
        </div>
        {openOrderPlaces &&

          <div style={{ position: "relative", padding: "20px", border: "2px solid black ", borderRadius: "10px", marginBottom: "20px" }}>
            <h3 style={{ textAlign: "center", marginTop: "0", fontSize: "28px" }}>Места заказа</h3>
            <div
              onClick={() => setOpenOrderPlaces(false)}
              className={styles.closeButton} >
              ×
            </div>
            <ol style={{ listStyleType: "none" }}>
              {mapPlaces}
            </ol>
          </div>}
        {openOrderFiles && <div style={{ position: "relative", display: "inline-block", padding: "10px", border: "2px solid black ", borderRadius: "10px" }}>
          <p>Файлы заказа:</p>
          <div
            onClick={() => setOpenOrderFiles(false)}
            className={styles.closeButton} >
            ×
          </div>
          <ol style={{ listStyleType: "none", marginTop: "30px" }}>
            {mapfiles}
          </ol>


          {addFileInOrder ?
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setOpenOrderFiles(false)}
                className={styles.closeButton} style={{ color: "red", zIndex: '100', fontSize: "10px", right: "-7px", top: "5px" }} >
                отмена
              </div>
              <DownloadFile invoiceFiles={filesOrder}
                setInvoiceFiles={setFilesOrder}
                showInvois={showFilesOrder}
                setShowInvois={setShowFilesOrder}
                isOrder={true}
                isUserSender={false}
                isUserRecipient={false} />

              <button style={{ border: "none", backgroundColor: "white", padding: "10px 0", marginTop: "10px", fontSize: "35px", position: "absolute", right: "-10px", top: "7px" }} onClick={() => onSubmit()}>❱❱❱</button>
            </div>
            :
            <button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }} onClick={() => setAddFileInOrder(true)}>Добавить файл</button>}
        </div>}


      </div>
    </div >
  )
  return (
    <div >
      {mapOrder}
    </div>
  )
}
export default OrderCopy