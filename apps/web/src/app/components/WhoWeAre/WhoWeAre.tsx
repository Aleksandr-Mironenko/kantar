import styles from './WhoWeAre.module.scss'


export default function WhoWeAre() {
  return (
    <section className={styles.who}>
      <div className="container">
        <h2 className={styles.h2}>Кто мы?</h2>
        <p className={styles.p}>Kantar – надежная логистическая компания.</p>
        <div className={styles.barier}></div>
        <h3 className={styles.h3}>KANTAR- ведущая логистическая компания, специализирующаяся на международных перевозках. Гибкость в подходах помогают разрешать сложные логистические задачи и подбирать лучшие транспортные решения для каждого груза, помогая нашим клиентам успешно развивать свой бизнес. Мы выполняем весь комплекс работ: от подготовки маршрута перевозки до таможенного оформления.</h3>
      </div>
    </section>
  )
}