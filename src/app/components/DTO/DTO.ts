export interface Place {
  heft: number;
  length: number;
  width: number;
  height: number;
  places: number;
  id: number;
  price: number;
  volume: number
}

export interface Country {
  id: number;
  name: string;
  zone: number;
}

export interface City {
  id: number;
  name: string;
  zone: string;
  numberZoneRF: number;
  numberZoneForeign: number
}
type Type_acc = "noAcc" | "request" | "private" | "OOO" | "IP";

export interface InitialData {
  nds: number;
  fs: number;
  fsRF: number;
  koefficient: number;
  fromCountryObj: Country | null,
  fromCityObj: City | null,
  whereCountryObj: Country | null,
  whereCityObj: City | null,
  price: number,
  count: number,
  document: "document" | "goods",
  isFinalHeft: number,
  places: Place[],
  isFinalOnlyHeft: number,
  isFinalOnlyVolume: number,
}
export interface OrderModalProps {
  initialData: InitialData,
  isOpen: boolean,
  onClose: () => void;
  alertNotification: (notification: PropsNotification) => void;
}

export interface FormValues {
  nameFrom: string;
  nameWhere: string;
  phoneFrom: string;
  phoneWhere: string;
  emailFrom: string;
  emailWhere: string;
  adressFrom: string;
  adressWhere: string;
  agree: boolean;
}

export interface FileObj {
  file: File | null,
  id: number
}

export interface DownloadButtonProps {
  filename: string,
  content?: string | Blob,
  fileUrl?: string,
  children?: React.ReactNode
}

export type DownloadFileProps = {
  invoiceFiles: FileObj[];
  setInvoiceFiles: React.Dispatch<React.SetStateAction<FileObj[]>>;
  showInvois: boolean;
  setShowInvois: React.Dispatch<React.SetStateAction<boolean>>;
  isOrder: boolean;
  isUserSender: boolean;
  isUserRecipient: boolean;
  isService?: boolean;
};

export interface IPFields {
  name: string;
  phone: string;
  email: string;
  ipName: string;
  realAddressIp: string;
  innip: string;
  ogrnip: string;
  rss: string;
  bik: string;
  kss: string;
  comment: string;
  agree: boolean;
}


export interface PrivateIndividualFields {
  name: string;
  phone: string;
  email: string;
  passport: string;
  comment: string;
  agree: boolean;
}

export interface OOOFields {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  nameGD: string;
  legalAddress: string;
  realAddress: string;
  innOoo: string;
  kpp: string;
  ogrn: string;
  rss: string;
  bik: string;
  kss: string;
  comment: string;
  agree: boolean;
}

export interface ValuesFromCalc {
  name: string;
  phone: string;
  email: string;
  comment: string;
  agree: boolean
}
export interface ValuesServicesAdmin {
  name: string;
  phone: string;
  email: string;
  comment: string
}

export interface PropsNotification {
  titleAlert: string,
  message: string
}
export interface CooperationProps {
  alertNotification: (notification: PropsNotification) => void;
}


export type DataCreateOrderProcess = {
  agree: boolean,
  client: "sender" | "recipient",
  phoneFrom: string,
  phoneWhere: string,
  emailFrom: string,
  emailWhere: string,
  fileArray: File[],
  isFinalHeft: number,
  isFinalOnlyHeft: number,
  isFinalOnlyVolume: number,
  price: number,
  count: number,
  fromCountryObj: Country,
  whereCountryObj: Country,
  fromCityObj: City | null,
  whereCityObj: City | null,
  showInvois: boolean,
  nameFrom: string,
  nameWhere: string,
  adressFrom: string,
  adressWhere: string,
  document: "document" | "goods",
  from: string,
  where: string,
  indexFrom: string,
  indexWhere: string,
  places: Place[],
  nds: number,
  fs: number,
  fsRF: number,
  koefficient: number,
  descriptionOfCargo: string,
}

export type DataCreateAddress = {
  fullAddress: string;
  countryName: string;
  countryZone: number;
  countryId: number;
  cityName: string | undefined;
  cityZone: string | undefined;
  cityIdRF?: number | undefined;
  cityIdForeign?: number | undefined;
  cityZoneId: number | undefined;
  index: string
};

export type Product = "individual-RF" | "express-RF" | "individual-international" | "express-international"

export type DataCreateOrder = {
  senderId: number,
  recipientId: number,
  senderAddressId: number,
  recipientAddressId: number,
  nameFrom: string,
  nameWhere: string,
  phoneFrom: string,
  phoneWhere: string,
  emailFrom: string,
  emailWhere: string,
  discount: number,
  price: number,
  isPaid: boolean,
  isFinalHeft: number,
  isFinalOnlyHeft: number,
  isFinalOnlyVolume: number,
  status: "new" | // новый заказ 
  "pickup_required_(processed)" | // требуется забор (обработано)
  "awaiting_payment_(shipped)" | // ожидает оплаты(отправлен)
  "awaiting_payment_(not_shipped)" | // ожидает оплаты(не отправлен)
  "in_transit" | // в пути
  "delivery_pending" | // согласовывается вручение
  "in_transit_(delivery)" | // в пути (вручение)
  "delivered" | // вручено
  "canceled" | //отменено
  "archived" //архивный
  agree: boolean,
  isIndividual: boolean
  document: "document" | "goods",
  loadingDate: Date | null,
  unloadingDate: Date | null
  senderName: string,
  senderType_acc: Type_acc,
  senderName_OOO: string | null,
  senderFio_gd_OOO: string | null,
  senderFio_IP: string | null,
  recipientName: string,
  recipientType_acc: Type_acc,
  recipientName_OOO: string | null,
  recipientFio_gd_OOO: string | null,
  recipientFio_IP: string | null,
  sender_country_name: string,
  recipient_country_name: string,
  sender_city_name: string | null,
  recipient_city_name: string | null,
  isSender: boolean,
  product: Product
}


export type orderIdForDataUploadFiles = [string, number] | []


export interface DataUploadFiles {
  orderId: orderIdForDataUploadFiles;
  files: File[];
  name?: string
}

export interface DataUploadUserFiles {
  userId: string;
  files: File[];
  name?: string
}

export interface DataCreatePlases {
  orderId: orderIdForDataUploadFiles;
  data: Place[];
  isInternal: boolean
  nds: number
}

export type DataCreateUser = {
  email: string;
  phone: string;
  name: string;
  isClient: boolean;
  typeAcc: Type_acc;
  discount: number;
};



export type DataFabricForOrder = {
  nds: number,
  dataprops: DataCreateOrderProcess,
  senderId: number,
  recipientId: number,
  senderAddressId: number,
  recipientAddressId: number,
  discount: number,
  document: "document" | "goods",
  status: "new" | // новый заказ 
  "pickup_required_(processed)" | // требуется забор (обработано)
  "awaiting_payment_(shipped)" | // ожидает оплаты(отправлен)
  "awaiting_payment_(not_shipped)" | // ожидает оплаты(не отправлен)
  "in_transit" | // в пути
  "delivery_pending" | // согласовывается вручение
  "in_transit_(delivery)" | // в пути (вручение)
  "delivered" | // вручено
  "canceled" | //отменено
  "archived" //архивный, 
  senderName: string,
  senderType_acc: Type_acc,
  senderName_OOO: string | null,
  senderFio_gd_OOO: string | null,
  senderFio_IP: string | null,
  recipientName: string,
  recipientType_acc: Type_acc,
  recipientName_OOO: string | null,
  recipientFio_gd_OOO: string | null,
  recipientFio_IP: string | null,
  senderCountry_name: string,
  recipientCountry_name: string,
  senderCity_name: string | null,
  recipientCity_name: string | null,
  isSender: boolean
}

// серверный
export type TableOrdersRecord = {
  id: string,
  order_number: number,
  created_at: string,
  sender_id: number,
  recipient_id: number
  address_from_id: number,
  address_where_id: number,
  name_from: string,
  name_where: string,
  phone_from: string,
  phone_where: string,
  email_from: string,
  email_where: string,
  discount_this_send: number,
  price_full: number,
  is_paid: boolean,
  heft_full: number,
  heft_only_full: number,
  volume_only_full: number,
  status: "new" | // новый заказ 
  "pickup_required_(processed)" | // требуется забор (обработано)
  "awaiting_payment_(shipped)" | // ожидает оплаты(отправлен)
  "awaiting_payment_(not_shipped)" | // ожидает оплаты(не отправлен)
  "in_transit" | // в пути
  "delivery_pending" | // согласовывается вручение
  "in_transit_(delivery)" | // в пути (вручение)
  "delivered" | // вручено
  "canceled" | //отменено
  "archived" //архивный
  is_individual: boolean,
  document: "document" | "goods" | null,
  loading_date: Date | null,
  unloading_date: Date | null,
  sender_type_acc: Type_acc,
  recipient_type_acc: Type_acc,
  sender_name: string,
  recipient_name: string,
  sender_name_OOO: string | undefined,
  sender_fio_gd_OOO: string | undefined,
  sender_fio_IP: string | undefined,
  recipient_name_OOO: string | undefined,
  recipient_fio_gd_OOO: string | undefined,
  recipient_fio_IP: string | undefined,
  sender_country_name: string,
  recipient_country_name: string,
  sender_city_name: string | undefined,
  recipient_city_name: string | undefined,
  isSender: "sender" | "recipient",
  product: Product
};

export type NewTableOrdersRecord = {
  id: number,
  order_number: number,
  created_at: string,
  sender_id: number,
  recipient_id: number
  address_from_id: number,
  address_where_id: number,
  name_from: string,
  name_where: string,
  phone_from: string,
  phone_where: string,
  email_from: string,
  email_where: string,
  discount_this_send: number,
  price_full: number,
  is_paid: boolean,
  heft_full: number,
  heft_only_full: number,
  volume_only_full: number,
  status: "new" | // новый заказ 
  "pickup_required_(processed)" | // требуется забор (обработано)
  "awaiting_payment_(shipped)" | // ожидает оплаты(отправлен)
  "awaiting_payment_(not_shipped)" | // ожидает оплаты(не отправлен)
  "in_transit" | // в пути
  "delivery_pending" | // согласовывается вручение
  "in_transit_(delivery)" | // в пути (вручение)
  "delivered" | // вручено
  "canceled" | //отменено
  "archived" //архивный
  is_individual: boolean,
  document: "document" | "goods" | null,
  loading_date: Date | null,
  unloading_date: Date | null,
  sender: UserInServer,
  recipient: UserInServer,
};



export interface TableOrdersRecordMeta {
  page: number,
  limit: number,
  total: number,
  totalPages: number,
  hasNext: boolean,
  hasPrev: boolean,
}


export interface TableOrdersRecorResponse {
  ok: boolean,
  arrayOrderObjData: TableOrdersRecord[],
  meta: TableOrdersRecordMeta,
}

// export interface PDFWayBill {
//   order_number: number,
//   date_create_at: string,
//   from_name: string,
//   from_full_adress: string,
//   from_city: string,
//   from_country: string,
//   where_name: string,
//   where_full_adress: string,
//   where_sity: string,
//   where_counter: string,
//   from_code: string,
//   where_code: string,
//   array_services: string,
//   saved_price: string,
//   volume_total_heft: number,
//   total_heft: number,
//   sum_places: number,
//   array_numbers_places: string,
//   order_id: number,
// }

export type StatusPlace = "confirmed" | "changes_have_been_made" | "client_responsibility" | "canceled"

export interface PleaseInServer {
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
  status_place: StatusPlace,
  sumPlaces: number
}

export interface AddressInServer {
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

export type TypeAcc = "noAcc" | "request" | "private" | "OOO" | "IP";

export interface UserInServer {
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


export type toCorrectUserAcc = {
  id: string | null,
  created_at: string | null,
  email: string | null,
  phone: string | null,
  name: string | null,
  address_id: number | null,
  is_client: boolean | null,
  is_dogovor: boolean | null,
  type_acc: TypeAcc | null,
  ref_code: string | null,
  count_refcode_use: number | null,
  discount: number | null,
  passport: string | null,
  snils: string | null,
  fio_gd_OOO: string | null,
  name_OOO: string | null,
  oficial_adress_OOO: string | null,
  actual_address_OOO: string | null,
  inn_OOO: string | null,
  kpp_OOO: string | null,
  ogrn_OOO: string | null,
  rs_OOO: string | null,
  bic_OOO: string | null,
  corr_score_OOO: string | null,
  comment: string | null,
  fio_IP: string | null,
  actual_address_IP: string | null,
  inn_IP: string | null,
  ogrn_IP: string | null,
  rs_IP: string | null,
  bic_IP: string | null,
  corr_score_IP: string | null,
}


export interface PDFWayBillClient {
  order_number: number;
  date_create_at: string;
  from_name: string;
  from_full_adress: string;
  from_city: string;
  from_country: string;
  where_name: string;
  where_full_adress: string;
  where_sity: string;
  where_counter: string;
  // from_code: string;
  // where_code: string;
  array_services: string;
  saved_price: string;
  volume_total_heft: number;
  total_heft: number;
  sum_places: number;
  array_numbers_places: string;
  from_phone: string;
  where_phone: string;
  product: string;
  payment: boolean;
  shipping_invoice: string;
  sender_markse: string;
  content: string;
  order_id: string;
}



export type CreateUserResult = {
  id: number;
  name: string;
  type_acc: TypeAcc;
  name_OOO: string | null;
  fio_gd_OOO: string | null;
  fio_IP: string | null;
};



export type CommentUserType = {

  id: string;
  user_id: string;
  author_id: string;
  text: string;
  created_at: string;

};

export interface ServicesAdminType {
  id: string,
  name: string,
  description: string,
  full_description: string,
  url_image: string,
  url_page: string,
  is_active: boolean,
  created_at: string,
  updated_at: string
  url_vizual_name: string,
  url_image_signed: string,
  is_main_component: boolean
}

export type TableOrdersRecordWithEvent = TableOrdersRecord & { eventType: string }

// клиентский
export type WSMessage =
  | { type: 'orders_full'; data: TableOrdersRecord[] }
  | { type: 'orders_batch'; data: TableOrdersRecordWithEvent[] }