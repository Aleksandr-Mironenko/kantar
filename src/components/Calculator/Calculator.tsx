import styles from './Calculator.module.scss'


export default function Calculator() {
  return (
    <section id="count" className={styles.calc}>
      <div className={styles.calc__container}>
        <h1 className={styles.calc__title}>Калькулятор доставки</h1>
        <p className={styles.calc__subtitle}>Форма расчета — сюда можно подключить форму и логику позже.</p>
        <a className={styles.calc__button} href="#services">
          кнопка раз
        </a>
        <a className={styles.calc__button} href="#services">
          кнопка 2
        </a>
      </div>
    </section>
  )
}