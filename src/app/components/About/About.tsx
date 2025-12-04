import styles from "./About.module.scss";

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <h2 className={styles.about__title}>О компании</h2>

      <p className={styles.about__text}>
        Мы — транспортная компания KANTAR Logistics. Работаем более 15 лет и обеспечиваем профессиональную
        доставку грузов по России и странам СНГ.
      </p>
    </section>
  );
}