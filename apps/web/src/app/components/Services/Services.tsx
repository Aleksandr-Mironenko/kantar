// import styles from './Services.module.scss'


// export default function Services() {
// const cards = new Array(6).fill(0).map((_, i) => ({ title: `Услуга ${i + 1}` }))

// const services = [
//   { title: "Международные перевозки", desc: "Авто, ЖД, авиа" },
//   { title: "Сборные грузы", desc: "Экономия и гибкость" },
//   { title: "Экспедирование", desc: "Полный цикл услуг" },
// ];

//   return (
//     <section className={styles.services}>
//       <div className="container">
//         <h2>Наши услуги</h2>
//         <div className={styles.grid}>
//           {cards.map((c, idx) => (
//             <article key={idx} className={styles.card}>
//               <div className={styles.icon}><img src="/placeholder.png" alt="" /></div>
//               <h4>{c.title}</h4>
//               <p>Короткое описание услуги.</p>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }



import styles from "./Services.module.scss";
import Image from "next/image";
export default function Services() {
  const services = [
    { title: "Международные перевозки", desc: "Авто, ЖД, авиа", id: 0, url: "https://i.pinimg.com/originals/19/89/44/198944ea9f57d70ea850fc868efbd4b6.jpg", alt: "Международные перевозки", page: "https://i.pinimg.com/originals/19/89/44/198944ea9f57d70ea850fc868efbd4b6.jpg" },
    { title: "Сборныевававамиdsdsds грузы", desc: "Экономия и гибкость", id: 1, url: "https://i.pinimg.com/originals/19/89/44/198944ea9f57d70ea850fc868efbd4b6.jpg", alt: "Международные перевозки", page: "https://i.pinimg.com/originals/19/89/44/198944ea9f57d70ea850fc868efbd4b6.jpg" },
    { title: "Экспедирование", desc: "Полный цикл услуг", id: 2, url: "https://i.pinimg.com/originals/19/89/44/198944ea9f57d70ea850fc868efbd4b6.jpg", alt: "Экспедирование", page: "https://i.pinimg.com/originals/19/89/44/198944ea9f57d70ea850fc868efbd4b6.jpg" },
  ];
  const cards = services.map((el) => {
    return (
      <li key={el.id} className={styles.services__item} >
        <a href={el.url} className={styles.services__link} >
          <Image
            className={styles.services__item_image}
            src={el.page}
            alt={el.alt}
            width={242}
            height={127}
            priority />
          <div className={styles.services__item_textBlock} >
            <h3 className={styles.services__item_title}>{el.title}</h3>
            <p className={styles.services__item_text}>{el.desc}</p>
          </div>
        </a>
      </li>
    )
  })

  return (
    <section id="services" className={styles.services}>
      <div className={styles.services__wrapper}>
        <div className={styles.services__titles}>
          <h2 className={styles.services__title}>УСЛУГИ</h2>
          <a className={styles.services__all_item} href={"https://ya.ru/images/search?img_url=https%3A%2F%2Fimg3.akspic.ru%2Fattachments%2Foriginals%2F7%2F1%2F2%2F0%2F0%2F100217-vodnye_elementy-vodopad-voda-vodotok-rastitelnost-2880x1800.jpg&lr=47&pos=0&rpt=simage&source=serp&text=%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B0"} >
            Все услуги
          </a>
        </div>

        <ul className={styles.services__items}>
          {cards}
        </ul>
      </div>
    </section>
  );
}