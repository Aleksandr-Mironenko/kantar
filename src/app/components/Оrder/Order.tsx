"use client"
import { useState, useEffect } from 'react'
import { TableOrdersRecord, FileObj } from "../DTO/DTO";
import { Flex, QRCode } from 'antd';
import type { QRCodeProps } from 'antd';
import { createStyles } from 'antd-style';
import { CommentUserType, PDFWayBillClient, toCorrectUserAcc, PleaseInServer, AddressInServer } from "../DTO/DTO";
import styles from './Оrder.module.scss'
import DownloadFile from "../Helpers/DownloadFile"
import Link from 'next/link';
import { relative } from 'path';
import Loader from "../Loader/Loader"
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


const Order = ({ numberOrder }: { numberOrder: number }) => {
  const { styles: classNames } = useStyles();

  const sharedProps: QRCodeProps = {
    value: `https://kanta-m26229ivc-aleksandrs-projects-45823929.vercel.app/admin/order/${numberOrder}`,
    size: 140,
    classNames,
  };

  const [place, setPlace] = useState<PleaseInServer[]>([])
  const [files, setFiles] = useState<string[]>([]);
  const [filesSender, setFilesSender] = useState<string[]>([]);
  const [filesRecipient, setFilesRecipient] = useState<string[]>([]);
  const [filesOrganizer, setFilesOrganizer] = useState<string[]>([]);

  const [filesOrder, setFilesOrder] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showFilesOrder, setShowFilesOrder] = useState<boolean>(false) //открыты ли файлы флаг

  const [filesUserSender, setFilesUserSender] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showFilesUserSender, setShowFilesUserSender] = useState<boolean>(false) //открыты ли файлы флаг

  const [filesUserRecipient, setFilesUserRecipient] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showFilesUserRecipient, setShowFilesUserRecipient] = useState<boolean>(false) //открыты ли файлы флаг

  const [filesUserOrganizer, setFilesUserOrganizer] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы

  const [showFilesUserOrganizer, setShowFilesUserOrganizer] = useState<boolean>(false) //открыты ли файлы флаг

  const [showComments, setShowComments] = useState<boolean>(false) //открыты ли файлы флаг

  const [userOrganizer, setUserOrganizer] = useState<toCorrectUserAcc>({
    id: "",
    created_at: "",
    email: "",
    phone: "",
    name: "",
    address_id: 0,//надо изменить создав новый или получив старый
    is_client: false,
    is_dogovor: false,
    type_acc: "noAcc",
    ref_code: "",//поменять
    count_refcode_use: null,
    discount: 0,
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
    comment: null,
    fio_IP: null,
    actual_address_IP: null,
    inn_IP: null,
    ogrn_IP: null,
    rs_IP: null,
    bic_IP: null,
    corr_score_IP: null,
  })

  const [userSendler, setUserSendler] = useState<toCorrectUserAcc>({
    id: "",
    created_at: "",
    email: "",
    phone: "",
    name: "",
    address_id: 0,//надо изменить создав новый или получив старый
    is_client: false,
    is_dogovor: false,
    type_acc: "noAcc",
    ref_code: "",//поменять
    count_refcode_use: null,
    discount: 0,
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
    comment: null,
    fio_IP: null,
    actual_address_IP: null,
    inn_IP: null,
    ogrn_IP: null,
    rs_IP: null,
    bic_IP: null,
    corr_score_IP: null,
  })

  const [userRecipient, setUserRecipient] = useState<toCorrectUserAcc>({
    id: "",
    created_at: "",
    email: "",
    phone: "",
    name: "",
    address_id: 0,//надо изменить создав новый или получив старый
    is_client: false,
    is_dogovor: false,
    type_acc: "noAcc",
    ref_code: "",//поменять
    count_refcode_use: null,
    discount: 0,
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
    comment: null,
    fio_IP: null,
    actual_address_IP: null,
    inn_IP: null,
    ogrn_IP: null,
    rs_IP: null,
    bic_IP: null,
    corr_score_IP: null,
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
      product: "express-RF",
      name_organizer: undefined,
      phone_organizer: undefined,
      email_organizer: undefined,
      organizer_type_acc: "noAcc",
      organizer_name_OOO: undefined,
      organizer_fio_gd_OOO: undefined,
      organizer_fio_IP: undefined,
      address_organizer_id: undefined,
      cost_of_cargo: 0,
      descriptionOfCargo: [{ value: "" }],
      agree: false
    }
  )

  const [openDataSendler, setOpenDataSendler] = useState<boolean>(false)
  const [openDataRecipient, setOpenDataRecipient] = useState<boolean>(false)
  const [openDataOrganizer, setOpenDataOrganizer] = useState<boolean>(false)

  const [openOrderFiles, setOpenOrderFiles] = useState<boolean>(false)
  const [openOrderFilesSender, setOpenOrderFilesSender] = useState<boolean>(false)
  const [openOrderFilesRecipient, setOpenOrderFilesRecipient] = useState<boolean>(false)
  const [openOrderFilesOrganizer, setOpenOrderFilesOrganizer] = useState<boolean>(false)

  const [addFileInOrder, setAddFileInOrder] = useState<boolean>(false)
  const [addFileInSendler, setAddFileInSendler] = useState<boolean>(false)
  const [addFileInOrganizer, setAddFileInOrganizer] = useState<boolean>(false)

  const [addFileInRecipient, setAddFileInRecipient] = useState<boolean>(false)
  const [openOrderPlaces, setOpenOrderPlaces] = useState<boolean>(false)

  const [comment, setComment] = useState<string>('')
  const [comments, setComments] = useState<CommentUserType[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const getOrder = async (numberOrder: number) => {
    const request = await fetch("/api/admin/admin-panel-poling/orders/search-one-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numberOrder
      })
    })

    if (!request.ok) {
      throw new Error("Ошибка получения заказа")
    }

    const response = await request.json();
    setOrder(response.dataOrder)
    setFiles(response.arrrfiles)
    setPlace(response.arrayPlacesInOrder ?? [])
    setUserOrganizer(response.dataUserOrganizer)
    setUserSendler(response.dataUserSendler)
    setUserRecipient(response.dataUserRecipient)
    setAddressSendler(response.dataAddressSendler)
    setAddressRecipient(response.dataAddressRecipient)
    setFilesOrganizer(response.filesOrganizer)
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
    getOrder(numberOrder)
  }

  useEffect(() => {
    if (!numberOrder) return;
    getOrder(numberOrder)
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

  const dateCreateOrder = (date: string) => {
    const qweqwe = new Date(date).toLocaleString()
    const aaa = qweqwe.split(",")
    const bbb = aaa[0].split(".")
    return `${bbb[0]}.${bbb[1]}.${bbb[2]} в ${aaa[1]} `
  }

  const dateCreateOrderLoad = (date: string) => {
    const qweqwe = new Date(date).toLocaleString()
    const aaa = qweqwe.split(",")
    const bbb = aaa[0].split(".")
    return `${bbb[0]}.${bbb[1]}.${bbb[2]}`
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
      <li className={styles.orderContainer__place}
        key={el.id}>
        <div className={styles.orderContainer__place_wrapper}>
          <p className={styles.orderContainer__place_marker} >
            {personalMarker}
          </p>
          <p className={styles.orderContainer__place_title}>
            Проверка фактических характеристик:
            <b className={styles.orderContainer__place_text}>
              {statusEl === "не проверен" ?
                <span>
                  {statusEl}
                </span> :
                statusEl}</b></p>
          <p className={styles.orderContainer__place_title}>
            Номер места:
            <b className={styles.orderContainer__place_text}>
              {el.id}
            </b></p>
          {/* <p>{new Date(order.created_at).toLocaleString()}</p> */}
          {/* <p> id заказа: {el.order_id}</p> */}
          <div className={styles.orderContainer__place_general}>
            <p className={styles.orderContainer__place_title}>
              Условная стоимость места:
              <b className={styles.orderContainer__place_text}>
                {Math.ceil(el.price / el.sumPlaces)} ₽
              </b></p>
            {el.nds > 0 && <p className={styles.orderContainer__place_title}>
              Условный НДС:
              <b className={styles.orderContainer__place_text}>
                {Math.ceil(el.nds / el.sumPlaces)} p.
              </b> </p>
            }
          </div>
          <div className={styles.orderContainer__place_personal}>
            <p className={styles.orderContainer__place_title}>
              Длина:
              <b className={styles.orderContainer__place_text}>
                {el.length} см.
              </b></p>
            <p className={styles.orderContainer__place_title}>
              Ширина:
              <b className={styles.orderContainer__place_text}>
                {el.width} см.
              </b></p>
            <p className={styles.orderContainer__place_title}>
              Высота:
              <b className={styles.orderContainer__place_text}>
                {el.height} см.
              </b></p>
            <p className={styles.orderContainer__place_title}>
              Вес:
              <b className={styles.orderContainer__place_text}>
                {el.heft} кг.
              </b></p>
            <p className={styles.orderContainer__place_title}>
              Объем:
              <b className={styles.orderContainer__place_text}>
                {el.volume} м³
              </b> </p>
          </div>
        </div>
      </li>
    )
  }
  )

  const mapFilesOrganizer = Array.isArray(filesOrganizer) ?
    filesOrganizer.map((el, index) => {
      const type = getFileType(el);
      return (
        <li key={el}
          className={styles.files__item}>
          {type === 'image' ? (
            <div className={styles.files__file}
            >
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
              <div className={styles.files__file}
              >
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
                <div className={styles.files__file}
                >
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
                  <div className={styles.files__file}
                  >
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
                    <div className={styles.files__file}
                    >
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
                    <div className={styles.files__file}
                    >
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

  const mapFilesSender = Array.isArray(filesSender) ?
    filesSender.map((el, index) => {
      const type = getFileType(el);
      return (
        <li key={el}
          className={styles.files__item}>
          {type === 'image' ? (
            <div className={styles.files__file}
            >
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
              <div className={styles.files__file}
              >
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
                <div className={styles.files__file}
                >
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
                  <div className={styles.files__file}
                  >
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
                    <div className={styles.files__file}
                    >
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
                    <div className={styles.files__file}
                    >
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
        <li key={el}
          className={styles.files__item}>
          {type === 'image' ? (
            <div className={styles.files__file}
            >
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
              <div className={styles.files__file}
              >
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
                <div className={styles.files__file}
                >
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
                  <div className={styles.files__file}
                  >
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
                    <div className={styles.files__file}
                    >
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
                    <div className={styles.files__file}
                    >
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
        <li key={el}
          className={styles.files__item}>
          {type === 'image' ? (
            <div className={styles.files__file}
            >
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
              <div className={styles.files__file}
              >
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
                <div className={styles.files__file}
                >
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
                  <div className={styles.files__file}
                  >
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
                    <div className={styles.files__file}
                    >
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
                    <div className={styles.files__file}
                    >
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

  const place_volume_total_heft = place?.reduce((acc, el) => acc + el.volume, 0) ?? 0

  const place_total_heft = place?.reduce((acc, el) => acc += el.heft, 0) ?? 0

  const stringNumbersPlaces = place
    .map(el => el.id)
    .join(', ')

  // const numbersOnly = Number(String(order.id).replace(/\D/g, ''));

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

    getOrder(numberOrder)
    setAddFileInOrder(false)
  };

  const onSubmitUserOrganization = async () => {
    if (!userOrganizer.id) return;
    const formData = new FormData();
    filesUserOrganizer.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });
    formData.append("userId", String(userOrganizer.id))       // id отправителя

    const response = await fetch("/api/admin/admin-actions/addFilesInUser", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")
    }
    getOrder(numberOrder)
    setAddFileInOrganizer(false)
  };

  const onSubmitUserSender = async () => {
    if (!userSendler.id) return;
    const formData = new FormData();
    filesUserSender.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });
    formData.append("userId", String(userSendler.id))

    const response = await fetch("/api/admin/admin-actions/addFilesInUser", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")
    }
    getOrder(numberOrder)
    setAddFileInSendler(false)
  };


  const onSubmitUserRecipient = async () => {
    if (!userRecipient.id) return;
    const formData = new FormData();
    filesUserRecipient.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });
    formData.append("userId", String(userRecipient.id))

    const response = await fetch("/api/admin/admin-actions/addFilesInUser", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")
    }
    getOrder(numberOrder)
    setAddFileInRecipient(false)
  };


  const organizerData = openDataOrganizer && userOrganizer.name !== "N/a" && (
    <div className={styles.orderContainer__clients_client}>
      <div
        onClick={() => setOpenDataOrganizer(false)}
        className={styles.closeButton} >
        ×
      </div>
      <h2 className={styles.orderContainer__clients_title}>
        Данные организатора
      </h2>

      {userOrganizer.type_acc === "OOO" &&
        <p className={styles.orderContainer__clients_name}>
          Название компании:
          <b className={styles.orderContainer__clients_text}>
            {userOrganizer.fio_gd_OOO}
          </b>
        </p>
      }

      {userOrganizer.type_acc === "OOO" &&
        <p className={styles.orderContainer__clients_name}>
          ФИО Ген.Директора:
          <b className={styles.orderContainer__clients_text}>
            {userOrganizer.fio_gd_OOO}
          </b>
        </p>
      }

      {userOrganizer.type_acc === "IP" &&
        <p className={styles.orderContainer__clients_name}>
          Имя ИП:
          <b className={styles.orderContainer__clients_text}>
            {userOrganizer.fio_IP}

          </b>
        </p>
      }

      <p className={styles.orderContainer__clients_name}>
        {userOrganizer.type_acc === "private" ? "ФИО клиента" : (userOrganizer.type_acc === "noAcc" || userOrganizer.type_acc === "request") ? "ФИО" : userOrganizer.type_acc === "OOO" ? "Представитель клиента" : userOrganizer.type_acc === "IP" ? "Представитель ИП" : "ФИО"}
        <b className={styles.orderContainer__clients_nameText}>
          {userOrganizer.name}
        </b>
      </p>


      <p className={styles.orderContainer__clients_phone}>
        Телефон:
        <b>
          <a className={styles.orderContainer__clients_textPhone}
            href={`tel:${userOrganizer.phone}`} >
            {userOrganizer.phone}
          </a>
        </b>
      </p>
      <p className={styles.orderContainer__clients_email}>
        Эл. почта:
        <b>
          <a className={styles.orderContainer__clients_textEmail}
            href={`mailto:${userOrganizer.email}`}
          >
            {userOrganizer.email}
          </a>
        </b>

      </p>

      {/* <p>{userSendler.created_at}</p>  */}
      {/*уже известно когда созданы места*/}
      <p className={styles.orderContainer__clients_description}>
        Персональная скидка клиента:
        <b className={styles.orderContainer__clients_textDescription}>
          {userOrganizer.discount} %
        </b></p>
      {/* <p>{userOrganizer.id}</p> */}{/*айдишник клиента*/}
      <p className={styles.orderContainer__clients_description}>
        Заключен договор:
        <b className={styles.orderContainer__clients_textDescription}>
          {userOrganizer.is_client ? "да" : "нет"}
        </b></p>{/* логика смены */}
      <p className={styles.orderContainer__clients_description}>
        Наличие договора:
        <b className={styles.orderContainer__clients_textDescription}>
          {userOrganizer.type_acc === "noAcc" || userOrganizer.type_acc === "request" ? "нет" : "да"}
        </b></p>
      {userOrganizer.type_acc !== "noAcc" && userOrganizer.type_acc !== "request" &&
        <p className={styles.orderContainer__clients_description}>
          Реферальный код:
          <b className={styles.orderContainer__clients_textDescription}>
            {userOrganizer.ref_code ? userOrganizer.ref_code : "не задан"}
          </b></p>}

      <Link
        className={styles.orderContainer__clients_linkUser}
        href={`/admin/user/${userOrganizer.id}`}>
        Перейти в профиль
      </Link>


      {openOrderFilesOrganizer
        ?
        <div className={styles.orderContainer__clients_files}>
          <div
            onClick={() => setOpenOrderFilesOrganizer(false)}
            className={`${styles.closeButton} ${styles.file_addClose}`} >
            ×
          </div>
          <p className={styles.orderContainer__clients_filesList}>Файлы отправителя:</p>
          <ol className={styles.files}>
            {mapFilesOrganizer}
          </ol>

          {addFileInOrganizer ?
            <div className={styles.files__add}>
              <div
                onClick={() => setAddFileInOrganizer(false)}
                className={`${styles.closeButton} ${styles.file__addClose}`}>
                отмена
              </div>

              <DownloadFile invoiceFiles={filesUserOrganizer}
                setInvoiceFiles={setFilesUserOrganizer}
                showInvois={showFilesUserOrganizer}
                setShowInvois={setShowFilesUserOrganizer}
                isOrder={false}
                isUserSender={false}
                isUserRecipient={false}
                isUserOrganizer={true} />
              <button className={styles.files__addSend}
                onClick={() => onSubmitUserOrganization()}>❱❱❱</button>
            </div>
            :
            <button className={styles.files__add_plus}
              onClick={() => setAddFileInOrganizer(true)}>Добавить файл</button>
          }
        </div>
        : <button className={styles.files__add_button}
          onClick={(e) => {
            e.preventDefault()
            setOpenOrderFilesOrganizer(true)
          }}>Открыть файлы отправителя</button>
      }
    </div>)


  const senderData = openDataSendler && (
    <div className={styles.orderContainer__clients_client}>
      <div
        onClick={() => setOpenDataSendler(false)}
        className={styles.closeButton} >
        ×
      </div>
      <h2 className={styles.orderContainer__clients_title}>
        Данные отправителя
      </h2>

      {userSendler.type_acc === "OOO" &&
        <p className={styles.orderContainer__clients_name}>
          Название компании:
          <b className={styles.orderContainer__clients_text}>
            {userSendler.fio_gd_OOO}
          </b>
        </p>
      }

      {userSendler.type_acc === "OOO" &&
        <p className={styles.orderContainer__clients_name}>
          ФИО Ген.Директора:
          <b className={styles.orderContainer__clients_text}>
            {userSendler.fio_gd_OOO}
          </b>
        </p>
      }

      {userSendler.type_acc === "IP" &&
        <p className={styles.orderContainer__clients_name}>
          Имя ИП:
          <b className={styles.orderContainer__clients_text}>
            {userSendler.fio_IP}

          </b>
        </p>
      }

      <p className={styles.orderContainer__clients_name}>
        {userSendler.type_acc === "private" ? "ФИО клиента:" : (userSendler.type_acc === "noAcc" || userSendler.type_acc === "request") ? "ФИО:" : userSendler.type_acc === "OOO" ? "Представитель клиента:" : userSendler.type_acc === "IP" ? "Представитель ИП:" : "ФИО:"}
        <b className={styles.orderContainer__clients_nameText}>
          {userSendler.name}
        </b>
      </p>


      <p className={styles.orderContainer__clients_phone}>
        Телефон:
        <b>
          <a className={styles.orderContainer__clients_textPhone}
            href={`tel:${userSendler.phone}`} >
            {userSendler.phone}
          </a>
        </b>
      </p>
      <p className={styles.orderContainer__clients_email}>
        Эл. почта:
        <b>
          <a
            className={styles.orderContainer__clients_textEmail}
            href={`mailto:${userSendler.email}`}
          >
            {userSendler.email}
          </a>
        </b>
      </p>
      <a
        href={`${yandexMapsLink(addressSendler.full_address)}`}
        className={styles.orderContainer__clients_map}
        target="_blank">
        НА КАРТЕ: {addressSendler.full_address}
      </a>

      {/* <p>{userSendler.created_at}</p>  */}
      {/*уже известно когда созданы места*/}
      <p className={styles.orderContainer__clients_description}>
        Персональная скидка клиента:
        <b className={styles.orderContainer__clients_textDescription}>
          {userSendler.discount} %
        </b></p>
      {/* <p>{userSendler.id}</p> */}{/*айдишник клиента*/}
      <p className={styles.orderContainer__clients_description}>
        Заключен договор:
        <b className={styles.orderContainer__clients_textDescription}>
          {userSendler.is_client ? "да" : "нет"}
        </b></p>
      <p className={styles.orderContainer__clients_description}>
        Наличие договора:
        <b className={styles.orderContainer__clients_textDescription}>
          {userSendler.type_acc === "noAcc" || userSendler.type_acc === "request" ? "нет" : "да"}
        </b></p>
      {userSendler.type_acc !== "noAcc" && userSendler.type_acc !== "request" &&
        <p className={styles.orderContainer__clients_description}>
          Реферальный код:
          <b className={styles.orderContainer__clients_textDescription}>
            {userSendler.ref_code ? userSendler.ref_code : "не задан"}
          </b></p>}

      <Link
        className={styles.orderContainer__clients_linkUser}
        href={`/admin/user/${userSendler.id}`}>
        Перейти в профиль
      </Link>


      {openOrderFilesSender
        ?
        <div className={styles.orderContainer__clients_files}>
          <div
            onClick={() => setOpenOrderFilesSender(false)}
            className={styles.closeButton} >
            ×
          </div>
          <p className={styles.orderContainer__clients_filesList}>
            Файлы отправителя:
          </p>
          <ol className={styles.files}>
            {mapFilesSender}
          </ol>

          {addFileInSendler ?
            <div className={styles.files__add}>
              <div
                onClick={() => setAddFileInSendler(false)}
                className={`${styles.closeButton} ${styles.file__addClose}`}>
                отмена
              </div>

              <DownloadFile invoiceFiles={filesUserSender}
                setInvoiceFiles={setFilesUserSender}
                showInvois={showFilesUserSender}
                setShowInvois={setShowFilesUserSender}
                isOrder={false}
                isUserSender={true}
                isUserRecipient={false}
                isUserOrganizer={false} />

              <button className={styles.files__addSend}
                onClick={() => onSubmitUserSender()}>❱❱❱</button>
            </div>
            :
            <button className={styles.files__add_plus}
              onClick={() => setAddFileInSendler(true)}>Добавить файл</button>
          }
        </div> : <button className={styles.files__add_button}
          onClick={(e) => {
            e.preventDefault()
            setOpenOrderFilesSender(true)
          }}>Открыть файлы отправителя</button>
      }
    </div>)


  const recipientData = openDataRecipient && (
    <div className={styles.orderContainer__clients_client}>

      <div
        onClick={() => setOpenDataRecipient(false)}
        className={styles.closeButton} >
        ×
      </div>
      <h2 className={styles.orderContainer__clients_title}>
        Данные получателя
      </h2>

      {userRecipient.type_acc === "OOO" &&
        <p className={styles.orderContainer__clients_name}>
          Название компании:
          <b className={styles.orderContainer__clients_text}>
            {userRecipient.fio_gd_OOO}
          </b>
        </p>
      }

      {userRecipient.type_acc === "OOO" &&
        <p className={styles.orderContainer__clients_name}>
          ФИО Ген.Директора:
          <b className={styles.orderContainer__clients_text}>
            {userRecipient.fio_gd_OOO}
          </b>
        </p>
      }

      {userRecipient.type_acc === "IP" &&
        <p className={styles.orderContainer__clients_name}>
          Имя ИП:
          <b className={styles.orderContainer__clients_text}>
            {userRecipient.fio_IP}

          </b>
        </p>
      }

      <p className={styles.orderContainer__clients_name}>
        {userRecipient.type_acc === "private" ? "ФИО клиента:" : (userRecipient.type_acc === "noAcc" || userRecipient.type_acc === "request") ? "ФИО:" : userRecipient.type_acc === "OOO" ? "Представитель клиента:" : userRecipient.type_acc === "IP" ? "Представитель ИП:" : "ФИО:"}
        <b className={styles.orderContainer__clients_nameText}>
          {userRecipient.name}
        </b>
      </p>


      <p className={styles.orderContainer__clients_phone}>
        Телефон:
        <b>
          <a className={styles.orderContainer__clients_textPhone}
            href={`tel:${userRecipient.phone}`} >
            {userRecipient.phone}
          </a>
        </b>
      </p>
      <p className={styles.orderContainer__clients_email}>
        Эл. почта:
        <b>
          <a
            className={styles.orderContainer__clients_textEmail}
            href={`mailto:${userRecipient.email}`}
          >
            {userRecipient.email}
          </a>
        </b>
      </p>
      <a
        href={`${yandexMapsLink(addressRecipient.full_address)}`}
        className={styles.orderContainer__clients_map}
        target="_blank">
        НА КАРТЕ: {addressRecipient.full_address}
      </a>

      {/* <p>{userSendler.created_at}</p>  */}
      {/*уже известно когда созданы места*/}
      <p className={styles.orderContainer__clients_description}>
        Персональная скидка клиента:
        <b className={styles.orderContainer__clients_textDescription}>
          {userRecipient.discount} %</b></p>
      {/* <p>{userSendler.id}</p> */}{/*айдишник клиента*/}
      <p className={styles.orderContainer__clients_description}>
        Заключен договор:
        <b className={styles.orderContainer__clients_textDescription}>
          {userRecipient.is_client ? "да" : "нет"}
        </b></p>
      <p className={styles.orderContainer__clients_description}>
        Наличие договора:
        <b className={styles.orderContainer__clients_textDescription}>
          {userRecipient.type_acc === "noAcc" || userRecipient.type_acc === "request" ? "нет" : "да"}
        </b></p>
      {userRecipient.type_acc !== "noAcc" && userRecipient.type_acc !== "request" &&
        <p className={styles.orderContainer__clients_description}>
          Реферальный код:
          <b className={styles.orderContainer__clients_textDescription}>
            {userRecipient.ref_code ? userRecipient.ref_code : "не задан"}
          </b></p>}

      <Link
        className={styles.orderContainer__clients_linkUser}
        href={`/admin/user/${userRecipient.id}`}>
        Перейти в профиль
      </Link>

      {openOrderFilesRecipient
        ?
        <div className={styles.orderContainer__clients_files}>
          <div
            onClick={() => setOpenOrderFilesRecipient(false)}
            className={styles.closeButton} >
            ×
          </div> {/*вернуться */}
          <p className={styles.orderContainer__clients_filesList}>
            Файлы получателя:
          </p>
          <ol className={styles.files}>
            {mapFilesRecipient}
          </ol>


          {addFileInRecipient ?
            <div className={styles.files__add}>
              <div
                onClick={() => setAddFileInRecipient(false)}
                className={`${styles.closeButton} ${styles.file__addClose}`}>
                отмена
              </div>
              <DownloadFile invoiceFiles={filesUserRecipient}
                setInvoiceFiles={setFilesUserRecipient}
                showInvois={showFilesUserRecipient}
                setShowInvois={setShowFilesUserRecipient}
                isOrder={false}
                isUserSender={false}
                isUserRecipient={true}
                isUserOrganizer={false}
              />

              <button className={styles.files__addSend}
                onClick={() => onSubmitUserRecipient()}>❱❱❱</button>
            </div>
            :
            <button className={styles.files__add_plus}
              onClick={() => setAddFileInRecipient(true)}>Добавить файл</button>
          }

        </div> : <button className={styles.files__add_button}
          onClick={(e) => {
            e.preventDefault()
            setOpenOrderFilesRecipient(true)
          }}>Открыть файлы получателя</button>
      }
    </div >)


  const getComment = async () => {
    console.log(numberOrder)
    if (!numberOrder) return; // безопасная проверка
    const request = await fetch(
      "/api/admin/admin-panel-poling/orders/comment-In_order/get",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: numberOrder
        }),
      }
    );
    if (!request.ok) {
      throw new Error("Ошибка получения комментариев");
    }
    const response = await request.json();
    setComments(response);
    console.log(response)
  };


  useEffect(() => {
    const timerId = setTimeout(() => {
      getComment();
    }, 5000);
    return () => clearTimeout(timerId);
  }, []);


  const commentAction = async (type: string, props: string | object) => {
    const request = await fetch("/api/admin/admin-panel-poling/orders/comment-In_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type, props
      })
    })
    if (!request.ok) {
      throw new Error(`Ошибка действий с комментарием ${type}`)
    }

    const response = await request.json();
    console.log(response)
    if (type === "add") { setComment("") }
    getComment()
  }


  const commentsMap = (comments ?? []).map((el: { id: string, user_id: string, author_id: string, text: string, created_at: string }) =>
  (<li
    className={styles.orderContainer__comments_itemBlock}
    key={el.id}
  >
    <p
      className={styles.orderContainer__comments_item}>
      <span className={styles.orderContainer__comments_create}>
        {dateCreateOrder(el.created_at)}
        :
      </span>

      {editingCommentId === el.id
        &&

        <textarea
          className={styles.orderContainer__comments_edit}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      }
      {editingCommentId === el.id
        ?
        <>
          <button className={`${styles.commentsButton} ${styles.orderContainer__comments_update}}`}
            onClick={() => {
              commentAction("update", { commentId: el.id, newText: newComment })
              setEditingCommentId(null)
            }}>
            ✓
          </button>
        </>
        :
        <>
          <span className={styles.orderContainer__comments_text}>
            {(el.text)}
          </span>
          <span>
            <button className={`${styles.commentsButton} ${styles.orderContainer__comments_buttonEdit}}`}
              onClick={() => {
                setEditingCommentId(el.id)
                setNewComment(el.text) // загружаем текст комментария для редактирования
              }}>
              🖉
            </button>
          </span>
        </>}
      <span>
        <button className={styles.commentsButton}
          onClick={() => commentAction("del", { commentId: el.id })} >
          ×
        </button>
      </span>
    </p>
  </li >
  )
  )


  const commentBlock = (
    <div className={styles.orderContainer__commentBlock}>
      <div
        onClick={() => setShowComments(false)}
        className={styles.closeButton} >
        ×
      </div>
      <p className={styles.orderContainer__commentBlock_title}>
        <b>Служебные отметки о заказе:</b>
      </p>
      <div className={styles.orderContainer__commentBlock_textblock}>
        <textarea
          className={styles.orderContainer__commentBlock_textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setComment((e.target as HTMLInputElement).value)
            }
          }}
        />
        <button
          className={`${styles.commentsButton} ${styles.orderContainer__commentBlock_add}`}
          onClick={() => commentAction("add", { order_number: numberOrder, text: comment, authorId: "937d1ef3-f9e8-4d4c-9a12-afcfabec996a" })}>❱❱❱</button>
      </div>
      <ol className={styles.orderContainer__comments}>
        {commentsMap}
      </ol>
    </div>)


  const propsPGF = {
    order_number: order.order_number,
    date_create_at: dateCreateOrder(order.created_at),
    from_name: userSendler.name as string,
    from_full_adress: addressSendler.full_address,
    from_city: addressSendler.city_name,
    from_country: addressSendler.country_name,
    where_name: userRecipient.name as string,
    where_full_adress: addressRecipient.full_address,
    where_sity: addressRecipient.city_name,
    where_counter: addressRecipient.country_name,//назвал поле неправильно подразумевал страну получения
    // from_code: `${addressSendler.country_zone}${addressSendler.city_zone ? ` ⯈  ${addressSendler.city_zone}` : ""}`,
    // where_code: `${addressRecipient.country_zone}${addressRecipient.city_zone ? ` ⯈  ${addressRecipient.city_zone}` : ""}`,
    array_services: "Список доп услуг 111111111111 11111111111 111111111 111111111 11111111 11111111 1111111111111111111",
    saved_price: "Страховка груза 1 Р",//страховку установить из order]
    volume_total_heft: place_volume_total_heft,
    total_heft: place_total_heft,
    sum_places: place?.[0]?.sumPlaces ?? 1,
    array_numbers_places: stringNumbersPlaces,
    from_phone: userSendler.phone as string,
    where_phone: userRecipient.phone as string,
    product: order.product,
    payment: order.is_paid,
    shipping_invoice: "номер счета",
    sender_markse: "комментарий",
    content: order.document === "document" ? "документы" : "груз",
    order_id: order.id
  }


  const mapOrder = (
    <div key={order.id}
      className={styles.orderContainer}>
      <div className={styles.orderContainer__content}>
        <div className={styles.orderContainer__info}>

          <h2 className={styles.orderContainer__title}>
            Номер заказа: {numberOrder}
          </h2>

          <div className={styles.orderContainer__qr}>
            <Flex gap="middle"  >
              <QRCode
                {...sharedProps}
                type="canvas"
                icon="https://cdn.iconscout.com/icon/premium/png-512-thumb/gps-arrow-icon-svg-download-png-6291895.png?f=webp&w=512"
                styles={stylesFunction}
              />
            </Flex>
            <button className={styles.orderContainer__buttonRule}
              onClick={(e) => {
                e.preventDefault()
                createPDFWaybill(propsPGF)
              }}>Создать waybill</button>

            {!openDataSendler && <button className={styles.orderContainer__buttonRule}
              onClick={(e) => {
                e.preventDefault()
                setOpenDataSendler(true)

              }}>Открыть отправителя</button>}
            {!openDataOrganizer && userOrganizer.name !== "N/a" &&
              <button className={styles.orderContainer__buttonRule}
                onClick={(e) => {
                  e.preventDefault()
                  setOpenDataOrganizer(true)
                }}>Открыть организатора</button>}
            {!openDataRecipient &&
              <button className={styles.orderContainer__buttonRule}
                onClick={(e) => {
                  e.preventDefault()
                  setOpenDataRecipient(true)
                }}>Открыть получателя</button>}
            {!openOrderFiles && <button className={styles.orderContainer__buttonRule}
              onClick={(e) => {
                e.preventDefault()
                setOpenOrderFiles(true)
              }}>Открыть файлы заказа</button>}

            {!openOrderPlaces && <button className={styles.orderContainer__buttonRule}
              onClick={(e) => {
                e.preventDefault()
                setOpenOrderPlaces(true)
              }}>Открыть места заказа</button>}

            {!showComments && <button className={styles.orderContainer__buttonRule}
              onClick={(e) => {
                e.preventDefault()
                setShowComments(true)
              }}>Комментарии к заказу</button>}


          </div>

        </div>

        <p className={styles.orderContainer__textblock}>
          Статус заказа:
          <b className={styles.orderContainer__textblock_text}>{status}</b></p>
        <p className={styles.orderContainer__textblock}>
          Был создан:
          <b className={styles.orderContainer__textblock_text}>{order.created_at ? dateCreateOrder(order.created_at) : ""}</b></p>
        <p className={styles.orderContainer__textblock}>
          Тип содержимого:
          <b className={styles.orderContainer__textblock_text}>{order.document === "document" ? "документ" : "груз"}</b></p>
        <div className={styles.orderContainer__textblock}>
          <p > Вес: <b className={styles.orderContainer__textblock_text}>{order.heft_only_full} кг</b></p>
          <p> Объем: <b className={styles.orderContainer__textblock_text}>{order.volume_only_full} м³</b></p>
          <p> Рассчетный вес: <b className={styles.orderContainer__textblock_text}>{order.heft_full} кг</b></p>
        </div>

        <div className={styles.orderContainer__textblock}>
          <p> Полная стоимость:
            <b className={styles.orderContainer__textblock_text}>
              {order.price_full} ₽
            </b>
            <span className={styles.orderContainer__textblock_error}>
              {order.is_individual ? "индивидуальный рассчет" : "фиксированная цена(экспресс)"}
            </span></p>
          <p> Индивидуальная скидка (заказа): <b className={styles.orderContainer__textblock_text}>{order.discount_this_send} %</b></p>
          <p> Поступление оплаты: <b className={styles.orderContainer__textblock_text}>{order.is_paid ? "оплачен" :
            <span className={styles.orderContainer__textblock_error}>
              не оплачен
            </span>}</b></p>

        </div>
        <div className={styles.orderContainer__textblock}>
          <p>Дата забора груза: <b>{order.loading_date ? dateCreateOrderLoad(String(order.loading_date)) :
            <span className={styles.orderContainer__textblock_error}>
              не выбрана
            </span>}</b></p>
          <p>Дата вручения груза: <b>{order.unloading_date ? dateCreateOrderLoad(String(order.unloading_date)) :
            <span className={styles.orderContainer__textblock_error}>
              не выбрана
            </span>}</b></p>

        </div>
        {showComments && commentBlock}
        <div className={styles.orderContainer__clients}
        >
          {organizerData}
          {senderData}
          {recipientData}
        </div>
        {openOrderPlaces &&

          <div className={styles.orderContainer__places}>
            <h3 className={styles.orderContainer__places_title}>
              Места заказа
            </h3>
            <div
              onClick={() => setOpenOrderPlaces(false)}
              className={styles.closeButton}>
              ×
            </div>
            <ol className={styles.orderContainer__places_map}>
              {mapPlaces}
            </ol>
          </div>}
        {openOrderFiles && <div className={styles.orderContainer__files}>
          <p>Файлы заказа:</p>
          <div
            onClick={() => setOpenOrderFiles(false)}
            className={styles.closeButton} >
            ×
          </div>
          <ol className={styles.orderContainer__filesList}>
            {mapfiles}
          </ol>


          {addFileInOrder ?
            <div className={styles.files__add}>
              <div
                onClick={() => setAddFileInOrder(false)}
                className={`${styles.closeButton} ${styles.file__addClose}`}>
                отмена
              </div>
              <DownloadFile invoiceFiles={filesOrder}
                setInvoiceFiles={setFilesOrder}
                showInvois={showFilesOrder}
                setShowInvois={setShowFilesOrder}
                isOrder={true}
                isUserSender={false}
                isUserRecipient={false}
                isUserOrganizer={false}
              />

              <button className={styles.files__addSend}
                onClick={() => onSubmit()}>❱❱❱</button>
            </div>
            :
            <button className={styles.files__add_plus}
              onClick={() => setAddFileInOrder(true)}>Добавить файл</button>}
        </div>}


      </div>
    </div >
  )


  return (

    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          {order.id === '' && order.id !== undefined ?
            (<div>
              <p>Минуточку...</p>
              <Loader />
            </div>) :
            mapOrder}

        </div>
      </div>
    </>

  )
}
export default Order 