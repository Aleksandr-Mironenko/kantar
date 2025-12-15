"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import { ValuesFromCalc } from "../DTO/DTO"
import styles from "./FormCalc.module.scss";


const schema = yup.object({
  name: yup.string().required("Имя обязательно"),
  phone: yup
    .string()
    .required("Телефон обязателен")
    .test("valid-phone", "Введите корректный номер", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10;
    }),
  email: yup.string().email("Неверный email").required("Email обязателен"),
  comment: yup.string().required("Комментарий обязателен"),
  agree: yup.boolean().required("Согласие обязательно").oneOf([true], "Согласие обязательно"),
});

export default function FormCalc() {
  //   const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<FormValues>({
  //     resolver: yupResolver(schema),
  //     mode: "onChange",
  //   });


  const { register, handleSubmit, control, formState: { errors, isValid, }, setValue, trigger, watch } = useForm<ValuesFromCalc>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",//"onChange",
    criteriaMode: "all",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      comment: "",
      agree: true,
    },
  });

  const onSubmit = (data: ValuesFromCalc) => console.log("FORM DATA:", data);

  // const onSubmit = async (data: FormValues) => {
  //   const formData = new FormData();
  //   formData.append("nameFrom", data.nameFrom);
  //   formData.append("nameWhere", data.nameWhere);
  //   formData.append("phoneFrom", data.phoneFrom);
  //   formData.append("phoneWhere", data.phoneWhere);
  //   formData.append("emailFrom", data.emailFrom);
  //   formData.append("emailWhere", data.emailWhere);
  //   formData.append("adressFrom", data.adressFrom);
  //   formData.append("adressWhere", data.adressWhere);
  //   formData.append("agree", data.agree ? "1" : "0");
  //   formData.append("document", document);
  //   formData.append("descriptionOfCargo", descriptionOfCargo);
  //   formData.append("isFinalHeft", String(isFinalHeft))
  //   formData.append("price", String(price))
  //   formData.append("count", String(count))
  //   formData.append("fs", String(fs));
  //   formData.append("fsRF", String(fsRF));
  //   formData.append("koefficient", String(koefficient));
  //   formData.append("fromCountryObj", JSON.stringify(fromCountryObj))
  //   formData.append("fromCityObj", JSON.stringify(fromCityObj))
  //   formData.append("whereCountryObj", JSON.stringify(whereCountryObj))
  //   formData.append("whereCityObj", JSON.stringify(whereCityObj))
  //   formData.append("from", from)
  //   formData.append("where", where)
  //   formData.append("indexFrom", indexFrom)
  //   formData.append("indexWhere", indexWhere)
  //   formData.append("client", client)
  //   formData.append("showInvois", showInvois ? "1" : "0")
  //   formData.append("places", JSON.stringify(places))
  //   invoiceFiles.forEach((el: {
  //     id: number;
  //     file: File | null;
  //   }) => {
  //     if (el.file) {
  //       formData.append(`files[${el.id}]`, el.file as File);
  //     }
  //   });


  //   const response = await fetch("/api/send-calculate", {
  //     method: "POST", body: formData,
  //   });
  //   if (!response.ok) {
  //     throw new Error("Ошибка отправки")

  //   } else {
  //     // const res = await response.json()
  //     // console.log(res, 163)
  //     setFrom("")
  //     setWhere("")
  //     setIndexFrom("")
  //     setIndexWhere("")
  //     setClient("sender")
  //     setInvoiceFiles([{ file: null, id: 0 }])
  //     setShowInvois(false)
  //     setDescriptionOfCargo("")
  //     reset()
  //     onClose()
  //   }

  // }



  return (
    <section className={styles.formcalc} >
      <div className={styles.formcalc__container}>
        <h2 className={styles.formcalc__title}>Заполните форму</h2>
        <form className={styles.formcalc__form} onSubmit={handleSubmit(onSubmit)}>

          <label className={errors.name ? styles.label_error : styles.label}>
            Имя
            <input autoComplete="given-name" {...register("name")} className={`${styles.input} ${errors.name ? styles.error : ""}`} placeholder="Ваше имя" />
            {errors.name && <p className={styles.errmsg}>{errors.name.message}</p>}
          </label>

          <label htmlFor="phone" className={`${styles.phone} ${errors.phone ? styles.label_error : styles.label}`}>
            Телефон отправителя
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <IMaskInput
                  id="phone"
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
                  className={`${styles.input} ${errors.phone ? styles.error : ""}`}
                />
              )}
            />

            {errors.phone && (
              <p className={styles.errmsg}>{errors.phone.message}</p>
            )}


          </label>

          <label className={errors.email ? styles.label_error : styles.label}>
            Email
            <input autoComplete="email" {...register("email")} className={`${styles.input} ${errors.email ? styles.error : ""}`} placeholder="example@mail.ru" />
            {errors.email && <p className={styles.errmsg}>{errors.email.message}</p>}
          </label>

          <label className={errors.comment ? styles.label_error : styles.label}>
            Комментарий
            <textarea {...register("comment")} className={`${styles.input} ${errors.comment ? styles.error : ""}`} placeholder="Ваш комментарий" rows={5} />
            {errors.comment && <p className={styles.errmsg}>{errors.comment.message}</p>}
          </label>
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
          <button type="submit" disabled={!isValid} className={styles.submit}>Рассчитать</button>
        </form>
      </div>
    </section >
  );
}