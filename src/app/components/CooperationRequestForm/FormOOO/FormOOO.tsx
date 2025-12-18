"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import { useState } from "react";
import styles from "../FormAll.module.scss";
import { CooperationProps, FileObj, OOOFields } from "../../DTO/DTO";
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

  companyName: yup
    .string()
    .required("Укажите имя компании"),

  nameGD: yup
    .string()
    .required("Ф.И.О. Ген директора"),

  legalAddress: yup
    .string()
    .required("Укажите юр адрес"),

  realAddress: yup
    .string()
    .required("Укажите фактический адрес"),

  innOoo: yup
    .string()
    .required("ИНН обязателен (10 цифр)")
    .test("valid-innOoo", "Введите (10 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 10;
    }),

  kpp: yup
    .string()
    .required("КПП обязателен (9 цифр)")
    .test("valid-kpp", "Введите (9 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 9;
    }),

  ogrn: yup
    .string()
    .required("ОГРН обязателен (13 цифр)")
    .test("valid-ogrn", "Введите (13 цифр)", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 13;
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


export default function FormOOO({ alertNotification }: CooperationProps) {
  const [invoiceFiles, setInvoiceFiles] = useState<FileObj[]>([{ file: null, id: 0 }])
  const [showInvois, setShowInvois] = useState<boolean>(false)

  const { register, handleSubmit, control, formState: { errors, isValid, },/* trigger, watch,*/ reset } = useForm<OOOFields>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      companyName: "",
      nameGD: "",
      legalAddress: "",
      realAddress: "",
      innOoo: "",
      kpp: "",
      ogrn: "",
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


  const onSubmit = async (data: OOOFields) => {
    const formData = new FormData();
    formData.append("client", "ooo");
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("companyName", data.companyName);
    formData.append("nameGD", data.nameGD);
    formData.append("legalAddress", data.legalAddress);
    formData.append("realAddress", data.realAddress)
    formData.append("innOoo", data.innOoo);
    formData.append("kpp", data.kpp);
    formData.append("ogrn", data.ogrn);
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
      reset()
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}  >
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


          <label className={errors.companyName ? styles.label_error : styles.label}>
            <span className={styles.label__span}> Название организации</span>
            <input
              {...register("companyName")}
              className={`${styles.input} ${errors.companyName ? styles.error : ""
                }`}
              placeholder="ООО «Ромашка»"
            />
            {errors.companyName && (
              <p className={styles.errmsg}>{errors.companyName.message}</p>
            )}
          </label>


          <label className={errors.nameGD ? styles.label_error : styles.label}>
            <span className={styles.label__span}> Ф.И.О. Ген. директора</span>
            <input {...register("nameGD")}
              className={`${styles.input} ${errors.nameGD ? styles.error : ""}`}
              placeholder="ООО «Ромашка»" />
            {errors.nameGD && <p className={styles.errmsg}>{errors.nameGD.message}</p>}
          </label>


          <label className={errors.legalAddress ? styles.label_error : styles.label}>
            <span className={styles.label__span}>Юридический адрес</span>
            <input {...register("legalAddress")}
              className={`${styles.input} ${errors.legalAddress ? styles.error : ""}`} />
            {errors.legalAddress && <p className={styles.errmsg}>{errors.legalAddress.message}</p>}
          </label>


          <label className={errors.realAddress ? styles.label_error : styles.label}>
            <span className={styles.label__span}>Фактический адрес</span>
            <input {...register("realAddress")}
              className={`${styles.input} ${errors.realAddress ? styles.error : ""}`} />
            {errors.realAddress && <p className={styles.errmsg}>{errors.realAddress.message}</p>}
          </label>


          <label className={errors.innOoo ? styles.label_error : styles.label}>
            <span className={styles.label__span}>ИНН</span>
            <Controller
              name="innOoo"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="0000 000 000"
                  placeholder="0000 000 000"
                  className={`${styles.input} ${errors.innOoo && styles.error}`}
                />
              )}
            />
            {errors.innOoo && <p className={styles.errmsg}>{errors.innOoo.message}</p>}
          </label>


          <label className={errors.kpp ? styles.label_error : styles.label}>
            <span className={styles.label__span}>КПП</span>
            <Controller
              name="kpp"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="000 000 000"
                  placeholder="000 000 000"
                  className={`${styles.input} ${errors.kpp && styles.error}`}
                />
              )}
            />
            {errors.kpp && <p className={styles.errmsg}>{errors.kpp.message}</p>}
          </label>


          <label className={errors.ogrn ? styles.label_error : styles.label}>
            <span className={styles.label__span}>ОГРН</span>
            <Controller
              name="ogrn"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="0000 000 000 000"
                  placeholder="0000 000 000 000"
                  className={`${styles.input} ${errors.ogrn && styles.error}`}
                />
              )}
            />
            {errors.ogrn && <p className={styles.errmsg}>{errors.ogrn.message}</p>}
          </label>

        </div>


        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Платежные реквизиты</h3>

          <label className={errors.rss ? styles.label_error : styles.label}>
            <span className={styles.label__span}>Расчётный счёт</span>
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