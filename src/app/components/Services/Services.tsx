// 'use client'

// import styles from "./Services.module.scss";
// import Image from "next/image";
// import { ServicesAdminType } from '@/app/components/DTO/DTO'
// import { useEffect, useState } from "react";
// export default function Services({ all = false }: { all: boolean }) {

//   const [services, setServices] = useState<ServicesAdminType[]>([])

//   const getServices = async () => {
//     const response = await fetch("/api/admin/admin-panel-poling/services-admin/get")
//     if (!response.ok) {
//       throw new Error("Ошибка получения сервисов")
//     }
//     const res = await response.json()
//     console.log(res)
//     setServices(res)
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       await getServices()
//     }
//     fetchData()
//   }, [])

//   const cards = services.map((el) => {
//     return el.is_active && (all ? true : el.is_main_component) ?
//       <li key={el.id} className={styles.services__item} >
//         <a
//           target="_blank"
//           href={`${all ? el.url_vizual_name : `services/${el.url_vizual_name}`}`}
//           className={styles.services__link} >
//           <Image
//             className={styles.services__item_image}
//             src={el.url_image_signed}
//             alt={el.url_vizual_name}
//             width={242}
//             height={127}
//             priority />
//           <div className={styles.services__item_textBlock} >
//             <h3 className={styles.services__item_title}>{el.name}</h3>
//             <p className={styles.services__item_text}>{el.description}</p>
//           </div>
//         </a>
//       </li> : null

//   })
//   return (
//     <section id="services" className={styles.services}>
//       <div className={styles.services__wrapper}>
//         <div className={styles.services__titles}>
//           <h2 className={styles.services__title}>{all ? "ВСЕ УСЛУГИ" : "УСЛУГИ"}</h2>
//           {!all && <a className={styles.services__all_item} href={"services/all"} >
//             Все услуги
//           </a>}
//         </div>

//         <ul className={styles.services__items}>
//           {cards}
//         </ul>
//       </div>
//     </section>
//   );
// }




//ssr 

import styles from "./Services.module.scss";
import Image from "next/image";
import Link from "next/link";
import { ServicesAdminType } from "@/app/components/DTO/DTO";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getServices(): Promise<ServicesAdminType[]> {
  const res = await fetch(
    `${baseUrl}/api/admin/admin-panel-poling/services-admin/get`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Ошибка получения сервисов");
  }

  return res.json();
}

export default async function Services({ all = false }: { all: boolean }) {
  const services = await getServices();

  return (
    <section id="services" className={styles.services}>
      <div className={styles.services__wrapper}>
        <header className={styles.services__titles}>
          <h2 className={styles.services__title}>
            {all ? "Все транспортные услуги" : "Наши услуги"}
          </h2>

          {!all && (
            <Link className={styles.services__all_item} href="/services/all">
              Все услуги
            </Link>
          )}
        </header>

        <ul className={styles.services__items}>
          {services
            .filter((el) => el.is_active && (all || el.is_main_component))
            .map((el) => (
              <li key={el.id} className={styles.services__item}>
                <article className={styles.services__card}>
                  <Link
                    href={all ? `/services/${el.url_vizual_name}` : `/services/${el.url_vizual_name}`}
                    className={styles.services__link}
                  >
                    <Image
                      className={styles.services__item_image}
                      src={el.url_image_signed}
                      alt={`${el.name} — транспортная услуга`}
                      width={242}
                      height={127}
                    />

                    <div className={styles.services__item_textBlock}>
                      <h3 className={styles.services__item_title}>{el.name}</h3>
                      <p className={styles.services__item_text}>{el.description}</p>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
        </ul>

        {/* SEO текст */}
        {!all && (
          <div className={styles.services__seoText}>
            <p style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px"
            }}>
              Наша транспортная компания предоставляет международные и внутренние
              грузоперевозки, обеспечивая безопасную логистику, страхование и
              контроль доставки. Мы работаем по всей Европе и предлагаем
              комплексные решения для бизнеса и частных клиентов.
            </p>
          </div>
        )}

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: services.map((el, index) => ({
                "@type": "Service",
                position: index + 1,
                name: el.name,
                url: `/services/${el.url_vizual_name}`,
                description: el.description,
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
