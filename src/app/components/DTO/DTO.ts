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
  places: Place[]
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
}



export interface DataUploadFiles {
  orderId: number[];
  files: File[];
}

export interface DataCreatePlases {
  orderId: number[];
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
}

// серверный
export type TableOrdersRecord = {
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
};

export type TableOrdersRecordWithEvent = TableOrdersRecord & { eventType: string }

// клиентский
export type WSMessage =
  | { type: 'orders_full'; data: TableOrdersRecord[] }
  | { type: 'orders_batch'; data: TableOrdersRecordWithEvent[] }