// components/OrderModal.tsx
"use client";

import { useEffect, useState } from "react";
// import { submitOrder } from "@/app/actions"; // ← твой Server Action
import styles from "./OrderModal.module.scss"
import { Country, City } from "../DTO/DTO"

interface InitialData {
  fromCountryObj: Country | null,
  fromCityObj: City | null,
  whereCountryObj: Country | null,
  whereCityObj: City | null,
  price: number
  count: number
}
interface OrderModalProps {
  initialData: InitialData,
  isOpen: boolean,
  onClose: () => void;
}

export default function OrderModal({ initialData, isOpen, onClose }: OrderModalProps) {


  const { fromCountryObj, fromCityObj, whereCountryObj, whereCityObj, price, count } = initialData;
  console.log(isOpen, fromCountryObj, fromCityObj, whereCountryObj, whereCityObj, price, count)

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [from, setFrom] = useState<string>("")
  const [where, setWhere] = useState<string>("")
  const [indexWhere, setIndexWhere] = useState<string>("")
  const [indexFrom, setIndexFrom] = useState<string>("")



  useEffect(() => {
    const country = whereCountryObj?.name || "";
    const city = whereCityObj?.name || "";
    const comma = city && country ? ", " : "";
    const iF = indexFrom ? `${indexFrom}, ` : "";
    setWhere(`${iF}${country}${comma}${city}, `);
  }, [whereCountryObj, whereCityObj, indexFrom]);

  useEffect(() => {
    const country = fromCountryObj?.name || "";
    const city = fromCityObj?.name || "";
    const comma = city && country ? ", " : "";
    const iW = indexWhere ? `${indexWhere}, ` : "";
    setFrom(`${iW}${country}${comma}${city}, `);
  }, [fromCountryObj, fromCityObj, indexWhere]);



  // const [fromCity, setFromCity] = useState<City | null>(fromCityObj)
  // const [whereCountry, setWhereCountry] = useState<Country | null>(whereCountryObj)
  // const [whereCity, setWhereCity] = useState<City | null>(whereCityObj)
  // const [pricee, setPricee] = useState<number>(price);
  // const [arr, setArr] = useState<Place[]>([
  //   {
  //     heft: 0.5,
  //     length: 10,
  //     width: 10,
  //     height: 10,
  //     places: 1,
  //     id: 0,
  //     price: 0,
  //     volume: 0
  //   },
  // ]);

  // if (!isOpen) return null;

  // const handleSubmit = async () => {
  //   if (!agree || !phone) {
  //     alert("Заполните телефон и согласитесь с обработкой данных");
  //     return;
  //   }

  // setIsLoading(true);

  // const fullPayload = {
  //   ...initialData,                    // ← всё с сервера
  //   contact: { name, phone, email },   // ← только клиент знает
  // };

  // const result = await submitOrder(fullPayload);

  // setIsLoading(false);

  //   if (result?.success) {
  //     alert("Заявка успешно отправлена!");
  //     onClose();
  //   } else {
  //     alert("Ошибка отправки. Попробуйте позже.");
  //   }
  // };
  // useEffect(() => {

  // }, [])

  return (
    <>
      {isOpen &&
        <div className={styles.modalOverlay} onClick={onClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modal__close} onClick={onClose}>
              ×
            </button>

            <h2 className={styles.modal__title}>Оформление заявки</h2>

            <div className={styles.modal__summary}>
              <p>
                <strong>Итого:</strong> {Math.ceil(price)} ₽
              </p>
              <p>
                <strong>Всего мест:</strong>  {count}
              </p>
              <p>Направление: {fromCountryObj && fromCityObj ? `${fromCountryObj?.name}-${fromCityObj?.name}` : `${fromCountryObj?.name}`} ➤ ➤ ➤</p>
              <p>  ➤ ➤ ➤ {whereCountryObj && whereCityObj ? `${whereCountryObj?.name}-${whereCityObj?.name}` : `${whereCountryObj?.name}`}</p>

            </div>

            <form className={styles.modal__form}>
              <input
                placeholder="Имя"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <input
                placeholder="Email (необязательно)"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                placeholder="Укажите точный адрес (необязательно)"
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
              <p>Укажите точный адрес (необязательно)</p>
              <input
                placeholder="Укажите индекс (необязательно)"
                value={indexFrom}
                onChange={e => setIndexFrom(e.target.value)}
              />

              <input
                placeholder="Укажите точный адрес (необязательно)"
                value={where}
                onChange={e => setWhere(e.target.value)}
              />
              <p>Укажите точный адрес (необязательно)</p>
              <input
                placeholder="Укажите индекс (необязательно)"
                value={indexWhere}
                onChange={e => setIndexWhere(e.target.value)}
              />



              <label className={styles.modal__checkbox}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                Согласен с обработкой персональных данных
              </label>

              <button
                className={styles.modal__submit}
                // onClick={handleSubmit}
                disabled={isLoading || !agree || !phone}
              >
                {/* {isLoading ? "Отправка..." : "Отправить заявку"} */}
              </button>
            </form>
          </div>
        </div>

      }
    </>)
}