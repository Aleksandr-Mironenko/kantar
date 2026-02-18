'use client'

import styles from "./Services.module.scss";
import Image from "next/image";
import { ServicesAdminType } from '@/app/components/DTO/DTO'
import { useEffect, useState } from "react";
export default function Services({ all = false }: { all: boolean }) {

  const [services, setServices] = useState<ServicesAdminType[]>([])

  const getServices = async () => {
    const response = await fetch("/api/admin/admin-panel-poling/services-admin/get")
    if (!response.ok) {
      throw new Error("Ошибка получения сервисов")
    }
    const res = await response.json()
    console.log(res)
    setServices(res)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getServices()
    }
    fetchData()
  }, [])

  const cards = services.map((el) => {
    return el.is_active && (all ? true : el.is_main_component) ?
      <li key={el.id} className={styles.services__item} >
        <a
          target="_blank"
          href={`${all ? el.url_vizual_name : `services/${el.url_vizual_name}`}`}
          className={styles.services__link} >
          <Image
            className={styles.services__item_image}
            src={el.url_image_signed}
            alt={el.url_vizual_name}
            width={242}
            height={127}
            priority />
          <div className={styles.services__item_textBlock} >
            <h3 className={styles.services__item_title}>{el.name}</h3>
            <p className={styles.services__item_text}>{el.description}</p>
          </div>
        </a>
      </li> : null

  })
  return (
    <section id="services" className={styles.services}>
      <div className={styles.services__wrapper}>
        <div className={styles.services__titles}>
          <h2 className={styles.services__title}>{all ? "ВСЕ УСЛУГИ" : "УСЛУГИ"}</h2>
          {!all && <a className={styles.services__all_item} href={"services/all"} >
            Все услуги
          </a>}
        </div>

        <ul className={styles.services__items}>
          {cards}
        </ul>
      </div>
    </section>
  );
}