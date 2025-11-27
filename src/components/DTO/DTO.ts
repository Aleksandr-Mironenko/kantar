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
