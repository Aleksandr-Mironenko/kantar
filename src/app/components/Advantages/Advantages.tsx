import styles from "./Advantages.module.scss";

export default function Advantages() {
  return (
    <section className={styles.advantages} id="advantages">
      <h2 className={styles.advantages__title}>Почему мы?</h2>

      <ul className={styles.advantages__list}>
        <li className={styles.advantages__item}>15 лет опыта</li>
        <li className={styles.advantages__item}>Страхование груза</li>
        <li className={styles.advantages__item}>Доставка точно в срок</li>
        <li className={styles.advantages__item}>Крупная собственная сеть</li>
      </ul>
    </section>
  );
}