"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IMaskInput } from "react-imask";

import styles from "./FormCalc.module.scss";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  comment: string;
}

const schema = yup.object({
  name: yup.string().required("Имя обязательно"),
  phone: yup
    .string()
    .required("Телефон обязателен")
    .test("valid-phone", "Введите корректный номер", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 11 && digits.startsWith("7");
    }),
  email: yup.string().email("Неверный email").required("Email обязателен"),
  comment: yup.string().required("Комментарий обязателен"),
});

export default function FormCalc() {
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormValues) => console.log("FORM DATA:", data);

  return (
    <section className={styles.formcalc}>
      <div className={styles.formcalc__container}>
        <h2 className={styles.formcalc__title}>Заполните форму</h2>
        <form className={styles.formcalc__form} onSubmit={handleSubmit(onSubmit)}>

          <label className={errors.name ? styles.label_error : styles.label}>
            Имя
            <input {...register("name")} className={`${styles.input} ${errors.name ? styles.error : ""}`} placeholder="Ваше имя" />
            {errors.name && <p className={styles.errmsg}>{errors.name.message}</p>}
          </label>

          <label className={errors.phone ? styles.label_error : styles.label}>
            Телефон
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="+7 (000) 000-00-00"
                  placeholder="+7 (___) ___-__-__"
                  className={`${styles.input} ${errors.phone ? styles.error : ""}`}
                />
              )}
            />
            {errors.phone && <p className={styles.errmsg}>{errors.phone.message}</p>}
          </label>

          <label className={errors.email ? styles.label_error : styles.label}>
            Email
            <input {...register("email")} className={`${styles.input} ${errors.email ? styles.error : ""}`} placeholder="example@mail.ru" />
            {errors.email && <p className={styles.errmsg}>{errors.email.message}</p>}
          </label>

          <label className={errors.comment ? styles.label_error : styles.label}>
            Комментарий
            <textarea {...register("comment")} className={`${styles.input} ${errors.comment ? styles.error : ""}`} placeholder="Ваш комментарий" rows={5} />
            {errors.comment && <p className={styles.errmsg}>{errors.comment.message}</p>}
          </label>

          <button type="submit" disabled={!isValid} className={styles.submit}>Рассчитать</button>
        </form>
      </div>
    </section>
  );
}