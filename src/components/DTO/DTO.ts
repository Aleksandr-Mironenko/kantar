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
  fromCountryObj: Country | null,
  fromCityObj: City | null,
  whereCountryObj: Country | null,
  whereCityObj: City | null,
  price: number
  count: number
}
export interface OrderModalProps {
  initialData: InitialData,
  isOpen: boolean,
  onClose: () => void;
}

export interface FormValues {
  name: string;
  phone: string;
  email: string;
  adressFrom: string;
  adressWhere: string;
  agree: boolean;
}