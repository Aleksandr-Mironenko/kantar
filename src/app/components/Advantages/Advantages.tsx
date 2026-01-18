import styles from "./Advantages.module.scss";

export default function Advantages() {
  return (
    <section className={styles.advantages} id="advantages">
      <h2 className={styles.advantages__title}>Почему мы?</h2>

      <div className={styles.advantages__list}>
        <div className={styles.advantages__item}>15 лет опыта</div>
        <div className={styles.advantages__item}>Страхование груза</div>
        <div className={styles.advantages__item}>Доставка точно в срок</div>
        <div className={styles.advantages__item}>Крупная собственная сеть</div>
      </div>
    </section>
  );
}