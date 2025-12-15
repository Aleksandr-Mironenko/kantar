"use client";

import { useState } from "react";
import styles from "./CooperationRequestForm.module.scss";
import FormIp from "./FormIp/FormIp"
import FormOOO from "./FormOOO/FormOOO"
import FormPrivate from "./FormPrivate/FormPrivate"


export default function CooperationRequestForm() {
  const [client, setClient] = useState<"OOO" | "IP" | "privateIndividual">("privateIndividual")

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

          {client === "IP" && <FormIp />}
          {client === "OOO" && < FormOOO />}
          {client === "privateIndividual" && <FormPrivate />}
        </div>
      </div>
    </section >
  );
}
