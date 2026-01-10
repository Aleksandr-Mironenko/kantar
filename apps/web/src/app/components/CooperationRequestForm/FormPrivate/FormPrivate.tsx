"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import { useState } from "react";
import styles from "../FormAll.module.scss";
import { CooperationProps, FileObj, PrivateIndividualFields } from "../../DTO/DTO";
import DownloadFile from "../../Helpers/DownloadFile"


const schema = yup.object({
  name: yup
    .string()
    .required("Имя обязательно"),

  phone: yup
    .string()
    .required("Телефон обязателен")
    .test("valid-phone", "Введите корректный номер", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 11;
    }),

  email: yup
    .string()
    .email("Неверный email")
    .required("Email обязателен")
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Введите корректный email"
    ),

  passport: yup
    .string()
    .required("Данные обязательны (10 цифр)")
    .test("valid-kss", "Введите (10 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10;
    }),


  comment: yup
    .string()
    .required("Комментарий обязателен"),

  agree: yup
    .boolean()
    .required("Согласие обязательно").
    oneOf([true], "Согласие обязательно"),
});


export default function FormPrivate({ alertNotification }: CooperationProps) {
  const [invoiceFiles, setInvoiceFiles] = useState<FileObj[]>([{ file: null, id: 0 }])
  const [showInvois, setShowInvois] = useState<boolean>(false)

  const { register, handleSubmit, control, formState: { errors, isValid, isSubmitted },   /*trigger, watch,*/ reset, setValue } = useForm<PrivateIndividualFields>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      passport: "",
      comment: "",
      agree: true,
    },
  });

  // useEffect(() => {
  //   const subscription = watch(() => {
  //     trigger();
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch, trigger]);


  const onSubmit = async (data: PrivateIndividualFields) => {
    const formData = new FormData();
    formData.append("client", "private");
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("passport", data.passport);
    formData.append("comment", data.comment);
    formData.append("agree", data.agree ? "1" : "0");

    invoiceFiles.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });

    const response = await fetch("/api/send-a-request-for-collaboration", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")

    } else {
      alertNotification({
        titleAlert: "Заявка на заключение договора отправлена",
        message: "С вами свяжется сотрудник компании с целью согласования даты и места встречи для подписания документов о сотрудничестве"
      });
      setInvoiceFiles([{ file: null, id: 0 }])
      // reset()
      setValue("name", "");
      setValue("phone", "");
      setValue("email", "");
      setValue("passport", "");
      setValue("comment", "");
    }
  }

  const requiredFields = useWatch({
    control,
    name: [
      "name",
      "phone",
      "email",
      "passport",
      "comment"
    ],
  });

  const agree = useWatch({ control, name: "agree" });

  // Проверяем, что все обязательные поля заполнены (не пустые) и нет ошибок по ним
  const allFieldsFilled = requiredFields.every(v => (typeof v === "string" || typeof v === "number") && String(v).trim() !== "");

  const isFilled =
    allFieldsFilled &&
    agree &&
    (!isSubmitted || Object.keys(errors).length === 0);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Контактные данные</h3>


          <label className={errors.name ? styles.label_error : styles.label}>
            <span className={styles.label__span}> Ф.И.О.</span>
            <input
              {...register("name")}
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              placeholder="Иванов Иван Иванович"
            />
            {errors.name && <p className={styles.errmsg}>{errors.name.message}</p>}
          </label>


          <label className={errors.phone ? styles.label_error : styles.label}>
            <span className={styles.label__span}> Телефон</span>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="+7 (000) 000-00-00"
                  placeholder="+7 (___) ___-__-__"
                  className={`${styles.input} ${errors.phone && styles.error}`}
                />
              )}
            />
            {errors.phone && <p className={styles.errmsg}>{errors.phone.message}</p>}
          </label>


          <label className={errors.email ? styles.label_error : styles.label}>
            <span className={styles.label__span}>Email</span>
            <input
              {...register("email")}
              type="email"
              className={`${styles.input} ${errors.email ? styles.error : ""}`}
              placeholder="example@mail.ru"
            />
            {errors.email && <p className={styles.errmsg}>{errors.email.message}</p>}
          </label>


          <label className={errors.passport ? styles.label_error : styles.label}>
            <span className={styles.label__span}>Данные паспорта</span>
            <Controller
              name="passport"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="00 00 - 00 00 00"
                  placeholder="00 00 - 00 00 00"
                  className={`${styles.input} ${errors.passport && styles.error}`}
                />
              )}
            />
            {errors.passport && <p className={styles.errmsg}>{errors.passport.message}</p>}
          </label>
        </div>


        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Документы и пожелания</h3>
          <div style={{ padding: "10px  0   20px 23px" }}>
            <DownloadFile
              invoiceFiles={invoiceFiles}
              setInvoiceFiles={setInvoiceFiles}
              showInvois={showInvois}
              setShowInvois={setShowInvois} />
          </div>


          <div className={styles.label__wrapper}  >
            <label className={errors.comment ? styles.label_error : styles.label}>
              <span className={styles.label__span}>Комментарий</span>
              <textarea {...register("comment")} rows={4}
                placeholder="Что для вас важно? Например укажите самый частый адрес доставки, регулярность, график..."
                className={`${styles.input} ${errors.comment ? styles.error : ""}`} />
              {errors.comment && <p className={styles.errmsg}>{errors.comment.message}</p>}
            </label>
          </div>


          <div className={styles.label__wrapper}>
            <label className={styles.label__checkbox}>
              <input
                type="checkbox"
                {...register("agree")} />
              <span>Согласен с обработкой персональных данных</span>
            </label>
            {errors.agree && <p className={styles.agreeErrmsg}>Согласие обязательно</p>}
          </div>

          <div className={styles.label__wrapper}  >
            <button
              disabled={!isFilled /*!isValid*/} className={styles.submit} type="submit" >
              Отправить заявку
            </button>
          </div>
        </div>
      </form >
    </>
  )
}