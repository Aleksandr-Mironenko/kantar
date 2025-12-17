"use client";

import { useEffect, useState } from "react";
import styles from "./CooperationRequestForm.module.scss";
import FormIp from "./FormIp/FormIp"
import FormOOO from "./FormOOO/FormOOO"
import FormPrivate from "./FormPrivate/FormPrivate"
import { PropsNotification } from "../DTO/DTO"
import Notification from "../NotificationAntd/NotificationAntd"


export default function CooperationRequestForm() {
  const [client, setClient] = useState<"OOO" | "IP" | "privateIndividual">("privateIndividual")
  const [notification, setNotification] = useState<boolean>(false)
  const [argsNotification, setArgsNotification] = useState<PropsNotification>({
    titleAlert: "",
    message: ""
  })

  //закрытие уведомления через 30 секунд
  useEffect(() => {
    if (notification) {
      const timerId = setTimeout(() => {
        setNotification(false)
      }, 30000)
      return () => clearTimeout(timerId)
    }
  }, [notification])

  const alertNotification = ({ titleAlert, message }: PropsNotification) => {
    setArgsNotification({ titleAlert, message })
    setNotification(true)
    console.log("alertNotification", titleAlert, message)
  }
  return (
    <section className={styles.formcalc} >
      <div className={styles.formcalc__container}>
        <h2 className={styles.formcalc__title}>Запрос на сотрудничество</h2>
        <div className={styles.formcalc__forms} >

          <div className={styles.radioGroup}>
            <button
              type="button"
              className={`${styles.radioButton} ${client === "OOO" ? styles.active : ""}`}
              onClick={() => setClient("OOO")}
            >
              ООО
            </button>

            <button
              type="button"
              className={`${styles.radioButton} ${client === "IP" ? styles.active : ""}`}
              onClick={() => setClient("IP")}
            >
              ИП
            </button>

            <button
              type="button"
              className={`${styles.radioButton} ${client === "privateIndividual" ? styles.active : ""}`}
              onClick={() => setClient("privateIndividual")}
            >
              Частное лицо
            </button>
          </div>

          {client === "IP" && <FormIp alertNotification={alertNotification} />}
          {client === "OOO" && < FormOOO alertNotification={alertNotification} />}
          {client === "privateIndividual" && <FormPrivate alertNotification={alertNotification} />}
          {notification && <Notification titleAlert={argsNotification.titleAlert}
            message={argsNotification.message} />}
        </div>
      </div>
    </section >
  );
}
