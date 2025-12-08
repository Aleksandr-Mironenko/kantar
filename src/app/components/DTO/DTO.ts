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
