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
  // const [isLoading, setIsLoading] = useState(false);

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

            <h2 className={styles.modal__title}>Формирование заявки</h2>

            <div className={styles.modal__summary}>

              <div className={styles.modal__info} style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={styles.modal__info_characteristics}
                  style={{ border: "1px solid black", borderRadius: "10px", padding: "10px", margin: "10px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }} >
                  <div className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column", padding: "16px" }}>
                    <p className={styles.modal__info_text} style={{
                      display: "block",
                      alignSelf: "stretch",
                      width: "100%",
                      textAlign: "center",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      margin: 0,
                      padding: 0
                    }}>
                      <strong>Характеристики отправления</strong>
                    </p>
                  </div>

                  <p className={styles.modal__info_text} style={{
                    display: "block",
                    alignSelf: "stretch",
                    width: "100%",
                    textAlign: "center",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    margin: 0,
                    padding: 0
                  }}>
                    <strong>Итого:</strong> {Math.ceil(price)} ₽
                  </p>
                  <p className={styles.modal__info_text} style={{
                    display: "block",
                    alignSelf: "stretch",
                    width: "100%",
                    textAlign: "center",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    margin: 0,
                    padding: 0
                  }}>
                    <strong>Всего мест:</strong>  {count}
                  </p>

                </div>
                <div className={styles.modal__info_direction}
                  style={{ border: "1px solid black", borderRadius: "10px", padding: "10px", margin: "10px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                  <p className={styles.modal__info_title}>
                    <strong>Направление: </strong>
                  </p>

                  <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                    {
                      fromCountryObj && fromCityObj ?
                        <div className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                          <p className={styles.modal__info_text} style={{
                            display: "block",
                            alignSelf: "stretch",
                            width: "100%",
                            textAlign: "center",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            margin: 0,
                            padding: 0
                          }}>
                            {fromCountryObj?.name}
                          </p>
                          <p className={styles.modal__info_text} style={{
                            display: "block",
                            alignSelf: "stretch",
                            width: "100%",
                            textAlign: "center",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            margin: 0,
                            padding: 0
                          }}>
                            -
                          </p>
                          <p className={styles.modal__info_text} style={{
                            display: "block",
                            alignSelf: "stretch",
                            width: "100%",
                            textAlign: "center",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            margin: 0,
                            padding: 0
                          }}>
                            {fromCityObj?.name}
                          </p>
                        </div>
                        :
                        <p className={styles.modal__info_text} style={{
                          display: "block",
                          alignSelf: "stretch",
                          width: "100%",
                          textAlign: "center",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          margin: 0,
                          padding: 0
                        }}> {fromCountryObj?.name} </p>
                    }
                    <p className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>  ⤋ ⤋ ⤋ ⤋ ⤋ ⤋ ⤋ ⤋</p>
                    {
                      whereCountryObj && whereCityObj ?
                        <div className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                          <p className={styles.modal__info_text} style={{
                            display: "block",
                            alignSelf: "stretch",
                            width: "100%",
                            textAlign: "center",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            margin: 0,
                            padding: 0
                          }}>
                            {whereCountryObj?.name}
                          </p>
                          <p className={styles.modal__info_text} style={{
                            display: "block",
                            alignSelf: "stretch",
                            width: "100%",
                            textAlign: "center",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            margin: 0,
                            padding: 0
                          }}>
                            -
                          </p>
                          <p className={styles.modal__info_text} style={{
                            display: "block",
                            alignSelf: "stretch",
                            width: "100%",
                            textAlign: "center",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            margin: 0,
                            padding: 0
                          }}>
                            {whereCityObj?.name}
                          </p>
                        </div>
                        :
                        <p className={styles.modal__info_text} style={{
                          display: "block",
                          alignSelf: "stretch",
                          width: "100%",
                          textAlign: "center",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          margin: 0,
                          padding: 0
                        }}>
                          {whereCountryObj?.name}
                        </p>
                    }
                  </div>

                </div>

              </div>


              <form className={styles.modal__form}
                style={{ margin: "10px 5px" }}>
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
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    style={{ margin: "auto 2px" }}
                  />
                  <span>Согласен с обработкой персональных данных</span>
                </label>



                <button
                  className={styles.modal__submit}
                // onClick={handleSubmit}
                // disabled={isLoading || !agree || !phone}
                >
                  {/* {isLoading ? "Отправка..." : "Отправить заявку"} */}
                </button>
              </form>
            </div>
          </div >
        </div >
      }
    </>
  )
}