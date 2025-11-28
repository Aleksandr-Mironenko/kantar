"use client";

import { useEffect, useState } from "react";
import styles from "./OrderModal.module.scss"
import { Country, City } from "../DTO/DTO"
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


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

interface FormValues {
  name: string;
  phone: string;
  email: string;
  adressFrom: string;
  indexFrom: string;
  adressWhere: string;
  indexWhere: string;
  agree: boolean
}


const schema = yup.object({
  name: yup.string().required("Имя обязательно"),
  phone: yup
    .string()
    .required("Телефон обязателен")
    .test("valid-phone", "Введите корректный номер", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, ""); // теперь это 10 цифр
      return digits.length === 10;
    }),
  email: yup
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


export default function OrderModal({ initialData, isOpen, onClose }: OrderModalProps) {

  const { fromCountryObj, fromCityObj, whereCountryObj, whereCityObj, price, count } = initialData;

  const [from, setFrom] = useState<string>("")
  const [where, setWhere] = useState<string>("")
  const [indexWhere, setIndexWhere] = useState<string>("")
  const [indexFrom, setIndexFrom] = useState<string>("")


  const { register, handleSubmit, control, formState: { errors, isValid, }, setValue, trigger, watch } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",//"onChange",
    criteriaMode: "all",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      adressFrom: from,
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



  const onSubmit = (data: FormValues) => console.log("FORM DATA:", data);//сюда к дате можно добавить еще значения которые были на страничке до этого и файл который прикладывает клиент

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
                            ▼
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
                    <p className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>   ▼   ▼   ▼  </p>
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
                            ▼
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
              <form onSubmit={handleSubmit(onSubmit)} className={styles.modal__form}
                style={{ margin: "10px 5px" }}>

                <label className={errors.name ? styles.label_error : styles.label}>
                  Ф.И.О.
                  <input {...register("name")} className={`${styles.input} ${errors.name ? styles.error : ""}`} placeholder="Ваше имя"
                  // onBlur={e => {
                  //   register("name").onBlur(e);
                  // }}
                  />
                  {errors.name && <p className={styles.errmsg}>{errors.name.message}</p>}
                </label>
                <label className={errors.phone ? styles.label_error : styles.label}>
                  Телефон
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <IMaskInput
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
                        className={`${styles.input} ${errors.phone ? styles.error : ""}`}
                      />
                    )}
                  />

                  {errors.phone && (
                    <p className={styles.errmsg}>{errors.phone.message}</p>
                  )}


                </label>

                <label className={errors.email ? styles.label_error : styles.label}>
                  Эл. почта
                  <input {...register("email")} className={`${styles.input} ${errors.email ? styles.error : ""}`} placeholder="example@mail.ru"
                  // onBlur={e => {
                  //   register("email").onBlur(e)
                  // }}
                  />
                  {errors.email && <p className={styles.errmsg}>{errors.email.message}</p>}
                </label>

                <label className={errors.adressFrom ? styles.label_error : styles.label}>
                  Адрес отправителя
                  <input
                    {...register("adressFrom")}
                    className={`${styles.input} ${errors.adressFrom ? styles.error : ""}`}
                    placeholder="Нужен полный адрес"
                  // onBlur={e => {
                  //   register("adressFrom").onBlur(e)
                  // }}
                  />
                  {errors.adressFrom && <p className={styles.errmsg}>{errors.adressFrom.message}</p>}
                </label>

                < label className={styles.label}>
                  Индекс отправителя
                  <input
                    placeholder="Укажите индекс отправителя"
                    value={indexFrom}
                    onChange={e => setIndexFrom(e.target.value)}
                  />
                </label>

                <label className={errors.adressWhere ? styles.label_error : styles.label}>
                  Адрес получателя
                  <input
                    {...register("adressWhere")}
                    className={`${styles.input} ${errors.adressWhere ? styles.error : ""}`}
                    placeholder="Нужен полный адрес"
                  // onBlur={e => {
                  //   register("adressWhere").onBlur(e)
                  // }}
                  />
                  {errors.adressWhere && <p className={styles.errmsg}>{errors.adressWhere.message}</p>}
                </label>

                < label className={styles.label}>
                  Индекс получателя
                  <input
                    placeholder="Укажите индекс получателя"
                    value={indexWhere}
                    onChange={e => setIndexWhere(e.target.value)}
                  />
                </label>


                <label className={styles.modal__checkbox}>
                  <input
                    type="checkbox"
                    {...register("agree")}
                  />
                  <span>Согласен с обработкой персональных данных</span>
                </label>
                {errors.agree && <p className={styles.errmsg}>Согласие обязательно</p>}


                <button
                  disabled={!isValid} className={styles.modal__submit} type="submit" >
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






// "use client";

// import { useEffect, useState } from "react";
// import styles from "./OrderModal.module.scss"
// import { Country, City } from "../DTO/DTO"
// import * as yup from "yup";
// import { IMaskInput } from "react-imask";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";


// interface InitialData {
//   fromCountryObj: Country | null,
//   fromCityObj: City | null,
//   whereCountryObj: Country | null,
//   whereCityObj: City | null,
//   price: number
//   count: number
// }
// interface OrderModalProps {
//   initialData: InitialData,
//   isOpen: boolean,
//   onClose: () => void;
// }

// interface FormValues {
//   name: string;
//   phone: string;
//   email: string;
//   adressFrom: string;
//   indexFrom: string;
//   adressWhere: string;
//   indexWhere: string;
//   agree: boolean
// }


// const schema = yup.object({
//   name: yup.string().required("Имя обязательно"),
//   phone: yup
//     .string()
//     .required("Телефон обязателен")
//     .test("valid-phone", "Введите корректный номер", (value) => {
//       if (!value) return false;
//       const digits = value.replace(/\D/g, "");
//       return digits.length === 11 && digits.startsWith("7");
//     }),
//   email: yup.string().email("Неверный email").required("Email обязателен"),
//   adressFrom: yup.string().required("Укажите полный адресс"),
//   adressWhere: yup.string().required("Укажите полный адресс"),
//   agree: yup.boolean().required("Согласие обязательно").oneOf([true], "Согласие обязательно"),
// });


// export default function OrderModal({ initialData, isOpen, onClose }: OrderModalProps) {


//   const { fromCountryObj, fromCityObj, whereCountryObj, whereCityObj, price, count } = initialData;
//   console.log(isOpen, fromCountryObj, fromCityObj, whereCountryObj, whereCityObj, price, count)

//   // const [phone, setPhone] = useState("");
//   // const [email, setEmail] = useState("");
//   // const [name, setName] = useState("");
//   // const [agree, setAgree] = useState(false);
//   // const [isLoading, setIsLoading] = useState(false);

//   const [from, setFrom] = useState<string>("")
//   const [where, setWhere] = useState<string>("")
//   const [indexWhere, setIndexWhere] = useState<string>("")
//   const [indexFrom, setIndexFrom] = useState<string>("")


//   const { register, handleSubmit, control, formState: { errors, isValid, isSubmitting }, setValue, reset, getValues } = useForm<FormValues>({
//     resolver: yupResolver(schema),
//     mode: "onBlur", // onChange
//     reValidateMode: "onChange",//"onChange",
//     defaultValues: {
//       name: "",
//       phone: "",
//       email: "",
//       adressFrom: "",    // ← начальное значение будет перезаписано в useEffect
//       adressWhere: "",
//       agree: false,
//     },
//   });

//   const onSubmit = (data: FormValues) => console.log("FORM DATA:", data);

//   useEffect(() => {
//     setValue("adressFrom", from);
//   }, [from, setValue]);

//   // ← то же самое для adressWhere
//   useEffect(() => {
//     setValue("adressWhere", where);
//   }, [where, setValue]);

//   useEffect(() => {
//     if (isOpen) {
//       reset({
//         name: "",
//         phone: "",
//         email: "",
//         adressFrom: from,
//         adressWhere: where,

//         agree: false,
//       });
//     }
//   }, [isOpen, from, where, indexFrom, indexWhere, reset]);

//   useEffect(() => {
//     const country = whereCountryObj?.name || "";
//     const city = whereCityObj?.name || "";
//     const comma = city && country ? ", " : "";
//     const iF = indexFrom ? `${indexFrom}, ` : "";
//     setWhere(`${iF}${country}${comma}${city}, `);
//   }, [whereCountryObj, whereCityObj, indexFrom]);

//   useEffect(() => {
//     const country = fromCountryObj?.name || "";
//     const city = fromCityObj?.name || "";
//     const comma = city && country ? ", " : "";
//     const iW = indexWhere ? `${indexWhere}, ` : "";
//     setFrom(`${iW}${country}${comma}${city}, `);
//   }, [fromCountryObj, fromCityObj, indexWhere]);

//   return (
//     <>
//       {isOpen &&
//         <div className={styles.modalOverlay} onClick={onClose}>
//           <div className={styles.modal} onClick={e => e.stopPropagation()}>
//             <button className={styles.modal__close} onClick={onClose}>
//               ×
//             </button>
//             <h2 className={styles.modal__title}>Формирование заявки</h2>
//             <div className={styles.modal__summary}>
//               <div className={styles.modal__info} style={{ display: "flex", justifyContent: "space-between" }}>
//                 <div className={styles.modal__info_characteristics}
//                   style={{ border: "1px solid black", borderRadius: "10px", padding: "10px", margin: "10px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }} >
//                   <div className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column", padding: "16px" }}>
//                     <p className={styles.modal__info_text} style={{
//                       display: "block",
//                       alignSelf: "stretch",
//                       width: "100%",
//                       textAlign: "center",
//                       wordBreak: "break-word",
//                       overflowWrap: "anywhere",
//                       margin: 0,
//                       padding: 0
//                     }}>
//                       <strong>Характеристики отправления</strong>
//                     </p>
//                   </div>
//                   <p className={styles.modal__info_text} style={{
//                     display: "block",
//                     alignSelf: "stretch",
//                     width: "100%",
//                     textAlign: "center",
//                     wordBreak: "break-word",
//                     overflowWrap: "anywhere",
//                     margin: 0,
//                     padding: 0
//                   }}>
//                     <strong>Итого:</strong> {Math.ceil(price)} ₽
//                   </p>
//                   <p className={styles.modal__info_text} style={{
//                     display: "block",
//                     alignSelf: "stretch",
//                     width: "100%",
//                     textAlign: "center",
//                     wordBreak: "break-word",
//                     overflowWrap: "anywhere",
//                     margin: 0,
//                     padding: 0
//                   }}>
//                     <strong>Всего мест:</strong>  {count}
//                   </p>
//                 </div>
//                 <div className={styles.modal__info_direction}
//                   style={{ border: "1px solid black", borderRadius: "10px", padding: "10px", margin: "10px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
//                   <p className={styles.modal__info_title}>
//                     <strong>Направление: </strong>
//                   </p>

//                   <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
//                     {
//                       fromCountryObj && fromCityObj ?
//                         <div className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
//                           <p className={styles.modal__info_text} style={{
//                             display: "block",
//                             alignSelf: "stretch",
//                             width: "100%",
//                             textAlign: "center",
//                             wordBreak: "break-word",
//                             overflowWrap: "anywhere",
//                             margin: 0,
//                             padding: 0
//                           }}>
//                             {fromCountryObj?.name}
//                           </p>
//                           <p className={styles.modal__info_text} style={{
//                             display: "block",
//                             alignSelf: "stretch",
//                             width: "100%",
//                             textAlign: "center",
//                             wordBreak: "break-word",
//                             overflowWrap: "anywhere",
//                             margin: 0,
//                             padding: 0
//                           }}>
//                             -
//                           </p>
//                           <p className={styles.modal__info_text} style={{
//                             display: "block",
//                             alignSelf: "stretch",
//                             width: "100%",
//                             textAlign: "center",
//                             wordBreak: "break-word",
//                             overflowWrap: "anywhere",
//                             margin: 0,
//                             padding: 0
//                           }}>
//                             {fromCityObj?.name}
//                           </p>
//                         </div>
//                         :
//                         <p className={styles.modal__info_text} style={{
//                           display: "block",
//                           alignSelf: "stretch",
//                           width: "100%",
//                           textAlign: "center",
//                           wordBreak: "break-word",
//                           overflowWrap: "anywhere",
//                           margin: 0,
//                           padding: 0
//                         }}> {fromCountryObj?.name} </p>
//                     }
//                     <p className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>  ⤋  ⤋  ⤋  </p>
//                     {
//                       whereCountryObj && whereCityObj ?
//                         <div className={styles.modal__info_block} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
//                           <p className={styles.modal__info_text} style={{
//                             display: "block",
//                             alignSelf: "stretch",
//                             width: "100%",
//                             textAlign: "center",
//                             wordBreak: "break-word",
//                             overflowWrap: "anywhere",
//                             margin: 0,
//                             padding: 0
//                           }}>
//                             {whereCountryObj?.name}
//                           </p>
//                           <p className={styles.modal__info_text} style={{
//                             display: "block",
//                             alignSelf: "stretch",
//                             width: "100%",
//                             textAlign: "center",
//                             wordBreak: "break-word",
//                             overflowWrap: "anywhere",
//                             margin: 0,
//                             padding: 0
//                           }}>
//                             -
//                           </p>
//                           <p className={styles.modal__info_text} style={{
//                             display: "block",
//                             alignSelf: "stretch",
//                             width: "100%",
//                             textAlign: "center",
//                             wordBreak: "break-word",
//                             overflowWrap: "anywhere",
//                             margin: 0,
//                             padding: 0
//                           }}>
//                             {whereCityObj?.name}
//                           </p>
//                         </div>
//                         :
//                         <p className={styles.modal__info_text} style={{
//                           display: "block",
//                           alignSelf: "stretch",
//                           width: "100%",
//                           textAlign: "center",
//                           wordBreak: "break-word",
//                           overflowWrap: "anywhere",
//                           margin: 0,
//                           padding: 0
//                         }}>
//                           {whereCountryObj?.name}
//                         </p>
//                     }
//                   </div>
//                 </div>
//               </div>
//               <form onSubmit={handleSubmit(onSubmit)} className={styles.modal__form}
//                 style={{ margin: "10px 5px" }}>
//                 <label className={errors.name ? styles.label_error : styles.label}>
//                   {/* Имя */}
//                   <input {...register("name")} className={`${styles.input} ${errors.name ? styles.error : ""}`} placeholder="Ваше имя"
//                   // onBlur={e => {
//                   //   register("name").onBlur(e);
//                   // }}
//                   />
//                   {errors.name && <p className={styles.errmsg}>{errors.name.message}</p>}
//                 </label>
//                 <label className={errors.phone ? styles.label_error : styles.label}>
//                   {/* Телефон */}
//                   <Controller
//                     name="phone"
//                     control={control}
//                     render={({ field }) => (
//                       <IMaskInput
//                         {...field}
//                         mask="+7 (000) 000-00-00"
//                         placeholder="+7 (___) ___-__-__"
//                         className={`${styles.input} ${errors.phone ? styles.error : ""}`}
//                       // onBlur={e => {
//                       //   register("phone").onBlur(e)
//                       // }}
//                       />
//                     )}
//                   />
//                   {errors.phone && <p className={styles.errmsg}>{errors.phone.message}</p>}
//                 </label>
//                 <label className={errors.email ? styles.label_error : styles.label}>
//                   {/* Email */}
//                   <input {...register("email")} className={`${styles.input} ${errors.email ? styles.error : ""}`} placeholder="example@mail.ru"
//                   // onBlur={e => {
//                   //   register("email").onBlur(e)
//                   // }}
//                   />
//                   {errors.email && <p className={styles.errmsg}>{errors.email.message}</p>}
//                 </label>
//                 <label className={errors.adressFrom ? styles.label_error : styles.label}>
//                   <input
//                     {...register("adressFrom")}
//                     className={`${styles.input} ${errors.adressFrom ? styles.error : ""}`}
//                     placeholder="Адрес откуда (можно уточнить)"
//                   // onBlur={e => {
//                   //   register("adressFrom").onBlur(e)
//                   // }}
//                   />
//                   {errors.adressFrom && <p className={styles.errmsg}>{errors.adressFrom.message}</p>}
//                 </label>
//                 <input
//                   placeholder="Укажите индекс (необязательно)"
//                   value={indexFrom}
//                   onChange={e => setIndexFrom(e.target.value)}
//                 />
//                 <label className={errors.adressWhere ? styles.label_error : styles.label}>
//                   <input
//                     {...register("adressWhere")}
//                     className={`${styles.input} ${errors.adressWhere ? styles.error : ""}`}
//                     placeholder="Адрес откуда (можно уточнить)"
//                   // onBlur={e => {
//                   //   register("adressWhere").onBlur(e)
//                   // }}
//                   />
//                   {errors.adressWhere && <p className={styles.errmsg}>{errors.adressWhere.message}</p>}
//                 </label>
//                 <input
//                   placeholder="Укажите индекс (необязательно)"
//                   value={indexWhere}
//                   onChange={e => setIndexWhere(e.target.value)}
//                 />
//                 <label className={styles.modal__checkbox}>
//                   <input
//                     type="checkbox"
//                     {...register("agree")}   // ← вот так
//                   />
//                   <span>Согласен с обработкой персональных данных</span>
//                 </label>
//                 {errors.agree && <p className={styles.errmsg}>Согласие обязательно</p>}
//                 <button
//                   className={styles.modal__submit} type="submit"
//                 >
//                 </button>
//               </form>
//             </div>
//           </div >
//         </div >
//       }
//     </>
//   )
// }




// adressFrom: yup.string().required("Укажите полный адресс"),
//   adressWhere: yup.string().required("Укажите полный адресс"),
//     indexFrom: yup.string().default("").notRequired(),// потом удалю пока следую интерфейсу
//       indexWhere: yup.string().default("").notRequired(),// потом удалю пока следую интерфейсу
//         agree: yup.boolean().required("Согласие обязательно").oneOf([true], "Согласие обязательно"),  
// 





{/* <label className={errors.indexFrom ? styles.label_error : styles.label}>
                  <input
                    {...register("indexFrom")}
                    className={`${styles.input} ${errors.indexFrom ? styles.error : ""}`}
                    placeholder="Адрес откуда (можно уточнить)"
                  />
                  {errors.adressFrom && <p className={styles.errmsg}>{errors.indexFrom.message}</p>}
                </label> */}

{/* <input
                  placeholder="Укажите точный адрес (необязательно)"
                  value={where}
                  onChange={e => setWhere(e.target.value)}
                /> */}


{/* <input
                  placeholder="Имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                /> */}


{/* <input
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                /> */}


{/* <input
                  placeholder="Email (необязательно)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                /> */}


{/* <input
                  placeholder="Укажите точный адрес (необязательно)"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                /> */}







{/* <label className={errors.indexWhere ? styles.label_error : styles.label}>
                  <input
                    {...register("indexWhere")}
                    className={`${styles.input} ${errors.indexWhere ? styles.error : ""}`}
                    placeholder="Адрес откуда (можно уточнить)"
                  />
                  {errors.indexWhere && <p className={styles.errmsg}>{errors.indexWhere.message}</p>}
                </label> */}



{/* <label className={styles.modal__checkbox}>
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    style={{ margin: "auto 2px" }}
                  />
                  <span>Согласен с обработкой персональных данных</span>
                </label> */}

{/* // onClick={handleSubmit}
                // disabled={isLoading || !agree || !phone}
                > */}
{/* {isLoading ? "Отправка..." : "Отправить заявку"} */ }