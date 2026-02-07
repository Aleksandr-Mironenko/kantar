"use client";

import { useEffect, useState } from "react";
import styles from "./CalcSend.module.scss";
import CalkSendExpress from "../CalkSendExpress/CalkSendExpress"
import CalkSendLong from "../CalkSendLong/CalkSendLong"


export default function CalcSend() {
  const [calc, setCalc] = useState<"express" | "long">("express")

  useEffect(() => {
    if (calc === "long") {
      setTimeout(() => {
        document
          .getElementById("calculator_long")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [calc]);

  const getLongCalc = () => {
    setCalc("long");
  };




  return (
    <section className={styles.formcalc} id="calculator" >
      <div className={styles.formcalc__container}>
        <div className={styles.formcalc__forms} >

          <div className={styles.radioGroup}>
            <button
              type="button"
              className={`${styles.radioButton} ${calc === "express" ? styles.active : ""}`}
              onClick={() => setCalc("express")}
            >
              Экспресс доставка
            </button>

            <button
              type="button"
              className={`${styles.radioButton} ${calc === "long" ? styles.active : ""}`}
              onClick={() => setCalc("long")}
            >
              Персональный рассчет
            </button>


          </div>

          {calc === "express" && <CalkSendExpress getLongCalc={getLongCalc} />}
          {calc === "long" && <CalkSendLong />}

        </div>
      </div>
    </section >
  );
}
