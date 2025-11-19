import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__container} >
        <h1 className={styles.hero__title}>
          Отправляйте
          грузы вместе с
          Kantar
        </h1>

        <p className={styles.hero__subtitle}>
          Быстрая и безопасная доставка грузов по России и всему миру.
        </p>

        <a className={styles.hero__button} href="#services">
          Рассчитать доставку
        </a>
        <a className={styles.hero__button} href="#services">
          О нас
        </a>
      </div>
    </section>
  );
}