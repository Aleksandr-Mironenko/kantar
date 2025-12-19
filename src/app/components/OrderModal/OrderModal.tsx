"use client";

import { useEffect, useState } from "react";
import styles from "./OrderModal.module.scss"
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OrderModalProps, FileObj, FormValues } from "../DTO/DTO"
// import DownloadButton from "../DownloadButton/DownloadButton"
import DownloadFile from "../Helpers/DownloadFile"




const schema = yup.object({
  nameFrom: yup.string().required("Имя обязательно"),
  nameWhere: yup.string().required("Имя обязательно"),
  phoneFrom: yup
    .string()
    .required("Телефон обязателен")
    .test("valid-phone", "Введите корректный номер", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10;
    }),
  phoneWhere: yup
    .string()
    .required("Телефон обязателен")
    .test("valid-phone", "Введите корректный номер", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10;
    }),
  emailFrom: yup
    .string()
    .required("Email обязателен")
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Введите корректный email"
    ),
  emailWhere: yup
    .string()
    .required("Email обязателен")
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Введите корректный email"
    ),
  adressFrom: yup.string().required("Укажите полный адресс"),
  adressWhere: yup.string().required("Укажите полный адресс"),
  agree: yup.boolean().required("Согласие обязательно").oneOf([true], "Согласие обязательно"),
});



export default function OrderModal({ initialData, isOpen, onClose, alertNotification }: OrderModalProps) {

  const {
    fs, //рассчетный транспортный налог не РФ
    fsRF, //рассчетный транспортный налог РФ
    koefficient, //скидка
    document, //документ или груз
    places,//массив характеристик отправлений 
    isFinalHeft, //вес по которому рассчет 
    fromCountryObj, // объект страны откуда
    fromCityObj, // объект города откуда
    whereCountryObj, // объект страны куда
    whereCityObj, // объект города куда
    price, // полная стоимость отправления
    count // количество мест
  } = initialData;

  const [from, setFrom] = useState<string>("") //полная строка откуда
  const [where, setWhere] = useState<string>("") //полная строка куда
  const [indexFrom, setIndexFrom] = useState<string>("") //индекс откуда
  const [indexWhere, setIndexWhere] = useState<string>("") //индекс куда
  const [client, setClient] = useState<"sender" | "recipient">("sender") //отправитель или получатель

  const [invoiceFiles, setInvoiceFiles] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showInvois, setShowInvois] = useState<boolean>(false) //открыты ли файлы флаг
  const [descriptionOfCargo, setDescriptionOfCargo] = useState<string>("")

  const { register, handleSubmit, control, formState: { errors, isValid }, setValue, trigger, watch, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",//"onChange",
    criteriaMode: "all",
    shouldUnregister: false,
    defaultValues: {
      nameFrom: "",
      phoneFrom: "",
      emailFrom: "",
      adressFrom: from,
      nameWhere: "",
      phoneWhere: "",
      emailWhere: "",
      adressWhere: where,
      agree: true,
    },
  });

  useEffect(() => {
    const subscription = watch(() => {
      trigger();
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("nameFrom", data.nameFrom);
    formData.append("nameWhere", data.nameWhere);
    formData.append("phoneFrom", data.phoneFrom);
    formData.append("phoneWhere", data.phoneWhere);
    formData.append("emailFrom", data.emailFrom);
    formData.append("emailWhere", data.emailWhere);
    formData.append("adressFrom", data.adressFrom);
    formData.append("adressWhere", data.adressWhere);
    formData.append("agree", data.agree ? "1" : "0");
    formData.append("document", document);
    formData.append("descriptionOfCargo", descriptionOfCargo);
    formData.append("isFinalHeft", String(isFinalHeft))
    formData.append("price", String(price))
    formData.append("count", String(count))
    formData.append("fs", String(fs));
    formData.append("fsRF", String(fsRF));
    formData.append("koefficient", String(koefficient));
    formData.append("fromCountryObj", JSON.stringify(fromCountryObj))
    formData.append("fromCityObj", JSON.stringify(fromCityObj))
    formData.append("whereCountryObj", JSON.stringify(whereCountryObj))
    formData.append("whereCityObj", JSON.stringify(whereCityObj))
    formData.append("from", from)
    formData.append("where", where)
    formData.append("indexFrom", indexFrom)
    formData.append("indexWhere", indexWhere)
    formData.append("client", client)
    formData.append("showInvois", showInvois ? "1" : "0")
    formData.append("places", JSON.stringify(places))
    invoiceFiles.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });


    const response = await fetch("/api/send-calculate", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")

    } else {
      alertNotification({
        titleAlert: "Заявка на экспресс доставку отправлена",
        message: "С вами свяжется сотрудник компании после обработки вашей заявки с целью забора посылки"
      });
      setFrom("")
      setWhere("")
      setIndexFrom("")
      setIndexWhere("")
      setClient("sender")
      // setInvoiceFiles([{ file: null, id: 0 }])
      // setShowInvois(true)
      // setDescriptionOfCargo("")
      reset()
      // setValue("nameFrom", "");
      // setValue("nameWhere", "");
      // setValue("phoneFrom", "");
      // setValue("phoneWhere", "");
      // setValue("emailFrom", "");
      // setValue("emailWhere", "");
      // setValue("adressFrom", from)
      // setValue("adressWhere", where);
      onClose()
    }
  };//при отправке обнуление очистить поля формы и закрыть ее

  useEffect(() => {
    setValue("adressFrom", from);
  }, [from, setValue]);

  useEffect(() => {
    setValue("adressWhere", where);
  }, [where, setValue]);

  useEffect(() => {
    const country = whereCountryObj?.name || "";
    const city = whereCityObj?.name || "";
    const comma = city && country ? ", " : "";
    const iF = indexWhere ? `${indexWhere}, ` : "";
    setWhere(`${iF}${country}${comma}${city}, `);
  }, [whereCountryObj, whereCityObj, indexWhere]);

  useEffect(() => {
    const country = fromCountryObj?.name || "";
    const city = fromCityObj?.name || "";
    const comma = city && country ? ", " : "";
    const iW = indexFrom ? `${indexFrom}, ` : "";
    setFrom(`${iW}${country}${comma}${city}, `);
  }, [fromCountryObj, fromCityObj, indexFrom]);



  const requiredFields = useWatch({
    control,
    name: [
      "nameFrom",
      "nameWhere",
      "phoneFrom",
      "phoneWhere",
      "emailFrom",
      "emailWhere",
      "adressFrom",
      "adressWhere",
    ],
  });


  const agree = useWatch({ control, name: "agree" });

  // Проверяем, что все обязательные поля заполнены (не пустые) и нет ошибок по ним
  const allFieldsFilled = requiredFields.every(v => (typeof v === "string" || typeof v === "number") && String(v).trim() !== "");

  // Проверяем, что в errors нет ошибок для обязательных полей
  const noErrorsInRequiredFields = requiredFields.every((field: string) => !errors[field as keyof typeof errors]);

  const isFilled = !!(allFieldsFilled && noErrorsInRequiredFields && Boolean(agree)
    && descriptionOfCargo && from && where && indexFrom && indexWhere && showInvois)




  return (
    <>
      {isOpen &&
        <div className={styles.modalOverlay} onClick={onClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>


            <div className={styles.modal__header}>
              <h2 className={styles.modal__title}>Формирование заявки</h2>
              <button className={styles.modal__close} onClick={onClose}>
                ×
              </button>
            </div>
            <div className={styles.modal__summary}>
              <div className={styles.modal__info}  >
                <div className={styles.modal__info_characteristics} >
                  <p className={styles.modal__info_title}  >
                    <strong>Направление: </strong>
                  </p>

                  <div className={styles.modal__info_directionDetails}  >
                    {
                      fromCountryObj && fromCityObj ?
                        <div className={styles.modal__info_block}  >
                          <p className={styles.modal__info_text}  >
                            {fromCountryObj?.name}
                          </p>
                          <p className={styles.modal__info_text}  >
                            ▼
                          </p>
                          <p className={styles.modal__info_text}  >
                            {fromCityObj?.name}
                          </p>
                        </div>
                        :
                        <p className={styles.modal__info_text}  > {fromCountryObj?.name} </p>
                    }
                    <p className={styles.modal__info_block}>   ▼   ▼   ▼  </p>
                    {
                      whereCountryObj && whereCityObj ?
                        <div className={styles.modal__info_block} >
                          <p className={styles.modal__info_text}  >
                            {whereCountryObj?.name}
                          </p>
                          <p className={styles.modal__info_text}  >
                            ▼
                          </p>
                          <p className={styles.modal__info_text}  >
                            {whereCityObj?.name}
                          </p>
                        </div>
                        :
                        <p className={styles.modal__info_text}  >
                          {whereCountryObj?.name}
                        </p>
                    }
                  </div>
                </div>
                <div className={styles.modal__info_characteristics}  >

                  <p className={styles.modal__info_title}
                  >
                    < strong > Характеристики отправления:</strong>
                  </p>

                  <div className={styles.modal__info_details} >
                    <p className={styles.modal__info_text}  >
                      <strong>Всего мест:</strong>  {count}
                    </p>
                    <p className={styles.modal__info_text}  >
                      <strong>Рассчетный вес:</strong>  {isFinalHeft}
                    </p>
                    <p className={styles.modal__info_text}  >
                      <strong>Стоимость:</strong> {Math.ceil(price)} ₽
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.modal__form}>
                <div className={styles.radioButton}>
                  <label className={styles.radio}>
                    <input
                      className={styles.radioButtonChenge}
                      type="radio"
                      name="type"
                      value="sender"
                      checked={client === "sender"}
                      onChange={(e) => setClient(e.target.value as "sender")}
                    /> Я отправитель
                  </label>
                  <label className={styles.radio}>
                    <input
                      className={styles.radioButtonChenge}
                      type="radio"
                      name="type"
                      value="recipient"
                      checked={client === "recipient"}
                      onChange={(e) => setClient(e.target.value as "recipient")}
                    /> Я получатель
                  </label >
                </div>
                <div className={styles.label__wrapper}  >
                  <label className={errors.nameFrom ? styles.label_error : styles.label}>
                    Ф.И.О. отправителя
                    <input autoComplete="given-name" {...register("nameFrom")} className={`${styles.input} ${errors.nameFrom ? styles.error : ""}`} placeholder="Ф.И.О. отправителя"
                    />

                    {errors.nameFrom && <p className={styles.errmsg}>{errors.nameFrom.message}</p>}
                  </label>
                </div>
                <div className={styles.label__wrapper} >
                  <label className={`${styles.phone} ${errors.phoneFrom ? styles.label_error : styles.label}`}>
                    Телефон отправителя
                    <Controller
                      name="phoneFrom"
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <IMaskInput
                          id="phoneFrom"
                          autoComplete="tel"
                          mask="+7 (000) 000-00-00"
                          placeholder="+7 (___) ___-__-__"
                          value={value ?? ""}
                          onAccept={(formatted) => {

                            const digits = formatted.replace(/\D/g, "");
                            const withoutFirst7 = digits.slice(1);
                            onChange(withoutFirst7);
                          }}
                          onBlur={onBlur}
                          inputRef={ref}
                          className={`${styles.input} ${errors.phoneFrom ? styles.error : ""}`}
                        />
                      )}
                    />

                    {errors.phoneFrom && (
                      <p className={styles.errmsg}>{errors.phoneFrom.message}</p>
                    )}


                  </label>
                </div>
                <div className={styles.label__wrapper} >
                  <label className={errors.emailFrom ? styles.label_error : styles.label}>
                    Эл. почта отправителя
                    <input autoComplete="email" {...register("emailFrom")} className={`${styles.input} ${errors.emailFrom ? styles.error : ""}`} placeholder="example@mail.ru"
                    />
                    {errors.emailFrom && <p className={styles.errmsg}>{errors.emailFrom.message}</p>}
                  </label>
                </div>
                <div className={styles.label__wrapper}  >
                  < label htmlFor="indexIdressFrom" className={`${styles.index} ${styles.label}`}>
                    Индекс отправителя
                    <input
                      autoComplete="postal-code"
                      name="indexIdressFrom"
                      id="indexIdressFrom"
                      placeholder="Укажите индекс отправителя"
                      value={indexFrom ?? ""}
                      onChange={e => setIndexFrom(e.target.value)}
                      className={styles.input}
                    />
                  </label>
                </div>
                <div className={styles.label__wrapper}  >
                  <label htmlFor="adressFrom" className={`${styles.adress} ${errors.adressFrom ? styles.label_error : styles.label}`}>
                    Адрес отправителя
                    <input
                      id="adressFrom"
                      autoComplete="street-address"
                      {...register("adressFrom")}
                      className={`${styles.input} ${styles.adress} ${errors.adressFrom ? styles.error : ""}`}
                      placeholder="Нужен полный адрес"
                    />
                    {errors.adressFrom && <p className={styles.errmsg}>{errors.adressFrom.message}</p>}
                  </label>
                </div>
                <div className={styles.label__wrapper}  >
                  <label className={errors.nameWhere ? styles.label_error : styles.label}>
                    Ф.И.О. получателя
                    <input
                      autoComplete="given-name"
                      {...register("nameWhere")}
                      className={`${styles.input} ${errors.nameWhere ? styles.error : ""}`} placeholder="Ф.И.О. получателя"
                    />

                    {errors.nameWhere && <p className={styles.errmsg}>{errors.nameWhere.message}</p>}
                  </label>
                </div>
                <div className={styles.label__wrapper}  >
                  <label className={`${styles.phone} ${errors.phoneWhere ? styles.label_error : styles.label}`}>
                    Телефон получателя
                    <Controller
                      name="phoneWhere"
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <IMaskInput
                          id="phoneWhere"
                          autoComplete="tel"
                          mask="+7 (000) 000-00-00"
                          placeholder="+7 (___) ___-__-__"
                          value={value ?? ""}
                          onAccept={(formatted) => {

                            const digits = formatted.replace(/\D/g, "");
                            const withoutFirst7 = digits.slice(1);
                            onChange(withoutFirst7);
                          }}
                          onBlur={onBlur}
                          inputRef={ref}
                          className={`${styles.input} ${errors.phoneWhere ? styles.error : ""}`}
                        />
                      )}
                    />

                    {errors.phoneWhere && (
                      <p className={styles.errmsg}>{errors.phoneWhere.message}</p>
                    )}


                  </label>
                </div>
                <div className={styles.label__wrapper} >
                  <label className={errors.emailWhere ? styles.label_error : styles.label}>
                    Эл. почта получателя
                    <input autoComplete="email" {...register("emailWhere")} className={`${styles.input} ${errors.emailWhere ? styles.error : ""}`} placeholder="example@mail.ru"
                    />
                    {errors.emailWhere && <p className={styles.errmsg}>{errors.emailWhere.message}</p>}
                  </label>
                </div>
                <div className={styles.label__wrapper}  >
                  < label htmlFor="indexIdressWhere" className={`${styles.index} ${styles.label}`}>
                    Индекс получателя
                    <input
                      name="indexIdressWhere"
                      id="indexIdressWhere"
                      autoComplete="postal-code"
                      placeholder="Укажите индекс получателя"
                      value={indexWhere ?? ""}
                      onChange={e => setIndexWhere(e.target.value)}
                      className={styles.input}
                    />
                  </label>
                </div>
                <div className={styles.label__wrapper}  >
                  <label htmlFor="adressWhere" className={`${styles.adress} ${errors.adressWhere ? styles.label_error : styles.label
                    }`}>
                    Адрес получателя
                    <input
                      id="adressWhere"
                      autoComplete="street-address"
                      {...register("adressWhere")}
                      className={`${styles.input} ${errors.adressWhere ? styles.error : ""}`}
                      placeholder="Нужен полный адрес"
                    />
                    {errors.adressWhere && <p className={styles.errmsg}>{errors.adressWhere.message}</p>}
                  </label>
                </div>
                {/* Инвойс */}
                {document === "goods" && <DownloadFile
                  invoiceFiles={invoiceFiles}
                  setInvoiceFiles={setInvoiceFiles}
                  showInvois={showInvois}
                  setShowInvois={setShowInvois} />
                }
                {document === "goods" &&
                  <div className={styles.label__wrapper}  >
                    < label htmlFor="descriptionOfCargo" className={`${styles.index} ${styles.label}`}>
                      Описание груза
                      <input
                        autoComplete="off"
                        name="descriptionOfCargo"
                        id="descriptionOfCargo"
                        placeholder="Описание и код ТНВЭД"
                        value={descriptionOfCargo ?? ""}
                        onChange={e => setDescriptionOfCargo(e.target.value)}
                        className={styles.input}
                      />
                    </label>
                  </div>
                }

                <div className={styles.label__wrapper}  >
                  <label className={styles.modal__checkbox}>
                    <input
                      type="checkbox"
                      {...register("agree")}
                    />
                    <span>Согласен с обработкой персональных данных</span>
                  </label>
                  {errors.agree && <p className={styles.agreeErrmsg}>Согласие обязательно</p>}
                </div>

                <button
                  disabled={!isFilled} className={styles.modal__submit} type="submit" >
                  отправить
                </button>
              </form>
            </div>
          </div >
        </div >
      }
    </>
  )
} 