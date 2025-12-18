"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import { useState } from "react";
import styles from "../FormAll.module.scss";
import { CooperationProps, FileObj, IPFields, PropsNotification } from "../../DTO/DTO";
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

  ipName: yup
    .string()
    .required("Ф.И.О. владельца ИП"),

  realAddressIp: yup
    .string()
    .required("Адрес регистрации ИП"),

  innip: yup
    .string()
    .required("ИНН обязателен (12 цифр)")
    .test("valid-innip", "Введите (12 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 12;
    }),

  ogrnip: yup
    .string()
    .required("ОГРН обязателен (15 цифр)")
    .test("valid-ogrnip", "Введите (15 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 15;
    }),

  rss: yup
    .string()
    .required("№ рассчетного счета обязателен (20 цифр)")
    .test("valid-rss", "Введите (20 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 20;
    }),

  bik: yup
    .string()
    .required("БИК обязателен (9 цифр)")
    .test("valid-rss", "Введите (9 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 9;
    }),

  kss: yup
    .string()
    .required("Корр счет обязателен (20 цифр)")
    .test("valid-kss", "Введите (20 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 20;
    }),

  comment: yup
    .string()
    .required("Комментарий обязателен"),

  agree: yup
    .boolean()
    .required("Согласие обязательно").
    oneOf([true], "Согласие обязательно"),
});


export default function FormIp({ alertNotification }: CooperationProps) {
  const [invoiceFiles, setInvoiceFiles] = useState<FileObj[]>([{ file: null, id: 0 }])
  const [showInvois, setShowInvois] = useState<boolean>(false)


  const { register, handleSubmit, control, formState: { errors, isValid, }, /*trigger, watch,*/ reset } = useForm<IPFields>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      ipName: "",
      realAddressIp: "",
      innip: "",
      ogrnip: "",
      rss: "",
      bik: "",
      kss: "",
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


  const onSubmit = async (data: IPFields) => {
    const formData = new FormData();
    formData.append("client", "ip");
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("ipName", data.ipName);
    formData.append("realAddressIp", data.realAddressIp);
    formData.append("innip", data.innip);
    formData.append("ogrnip", data.ogrnip);
    formData.append("rss", data.rss);
    formData.append("bik", data.bik);
    formData.append("kss", data.kss);
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
      reset({
        agree: true,
      });
    }
  }
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

        </div>


        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Реквизиты компании </h3>


          <label className={errors.ipName ? styles.label_error : styles.label}>
            <span className={styles.label__span}> Ф.И.О. Владельца</span>
            <input {...register("ipName")}
              className={`${styles.input} ${errors.ipName ? styles.error : ""}`}
              placeholder="ИП Иванов И.И." />
            {errors.ipName && <p className={styles.errmsg}>{errors.ipName.message}</p>}
          </label>


          <label className={errors.realAddressIp ? styles.label_error : styles.label}>
            <span className={styles.label__span}> Адрес регистрации ИП </span>
            <input {...register("realAddressIp")}
              className={`${styles.input} ${errors.realAddressIp ? styles.error : ""}`} />
            {errors.realAddressIp && <p className={styles.errmsg}>{errors.realAddressIp.message}</p>}
          </label>


          <label className={errors.innip ? styles.label_error : styles.label}>
            <span className={styles.label__span}> ИНН </span>
            <Controller
              name="innip"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="000 000 000 000"
                  placeholder="000 000 000 000"
                  className={`${styles.input} ${errors.innip && styles.error}`}
                />
              )}
            />
            {errors.innip && <p className={styles.errmsg}>{errors.innip.message}</p>}
          </label>


          <label className={errors.ogrnip ? styles.label_error : styles.label}>
            <span className={styles.label__span}> ОРГНИП </span>
            <Controller
              name="ogrnip"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="000 000 000 000 000"
                  placeholder="000 000 000 000 000"
                  className={`${styles.input} ${errors.ogrnip && styles.error}`}
                />
              )}
            />
            {errors.ogrnip && <p className={styles.errmsg}>{errors.ogrnip.message}</p>}
          </label>

        </div>


        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Платежные реквизиты</h3>


          <label className={errors.rss ? styles.label_error : styles.label}>
            <span className={styles.label__span}> Расчётный счёт </span>
            <Controller
              name="rss"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="0000 0000 0000 0000 0000"
                  placeholder="0000 0000 0000 0000 0000"
                  className={`${styles.input} ${errors.rss && styles.error}`}
                />
              )}
            />
            {errors.rss && <p className={styles.errmsg}>{errors.rss.message}</p>}
          </label>


          <label className={errors.bik ? styles.label_error : styles.label}>
            <span className={styles.label__span}> БИК </span>
            <Controller
              name="bik"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="000 000 000"
                  placeholder="000 000 000"
                  className={`${styles.input} ${errors.bik && styles.error}`}
                />
              )}
            />
            {errors.bik && <p className={styles.errmsg}>{errors.bik.message}</p>}
          </label>


          <label className={errors.kss ? styles.label_error : styles.label}>
            <span className={styles.label__span}>Корр счёт </span>
            <Controller
              name="kss"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="0000 0000 0000 0000 0000"
                  placeholder="0000 0000 0000 0000 0000"
                  className={`${styles.input} ${errors.kss && styles.error}`}
                />
              )}
            />
            {errors.kss && <p className={styles.errmsg}>{errors.kss.message}</p>}
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
              disabled={!isValid} className={styles.submit} type="submit" >
              Отправить заявку
            </button>
          </div>
        </div>
      </form >
    </>
  )
}