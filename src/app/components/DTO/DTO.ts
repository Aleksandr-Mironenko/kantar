import React from "react";

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

export interface InitialData {
  fs: number;
  fsRF: number;
  koefficient: number;
  fromCountryObj: Country | null,
  fromCityObj: City | null,
  whereCountryObj: Country | null,
  whereCityObj: City | null,
  price: number
  count: number
  document: "document" | "goods"
  isFinalHeft: number
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
