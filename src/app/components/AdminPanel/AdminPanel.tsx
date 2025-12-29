import styles from "./AdminPanel.module.scss";

export default function AdminPanel() {
  return (
    <section className={styles.advantages} id="advantages">
      <h2 className={styles.advantages__title}>Админ панель</h2>


      <div className={styles.advantages__list}>{/*блок создать заказ*/}
        {/* <div className={styles.advantages__item}>15 лет опыта</div>
        <div className={styles.advantages__item}>Страхование груза</div>
        <div className={styles.advantages__item}>Доставка точно в срок</div>
        <div className={styles.advantages__item}>Крупная собственная сеть</div> */}
      </div>
      <div className={styles.advantages__list}>{/*блок новые заказы*/}
        {/* <div className={styles.advantages__item}>15 лет опыта</div>
        <div className={styles.advantages__item}>Страхование груза</div>
        <div className={styles.advantages__item}>Доставка точно в срок</div>
        <div className={styles.advantages__item}>Крупная собственная сеть</div> */}
      </div>
      <div className={styles.advantages__list}>{/*блок все заказы*/}
        {/* <div className={styles.advantages__item}>15 лет опыта</div>
        <div className={styles.advantages__item}>Страхование груза</div>
        <div className={styles.advantages__item}>Доставка точно в срок</div>
        <div className={styles.advantages__item}>Крупная собственная сеть</div> */}
      </div>
      <div className={styles.advantages__list}>{/*услуги редактирование просмотр и тд*/}
        {/* <div className={styles.advantages__item}>15 лет опыта</div>
        <div className={styles.advantages__item}>Страхование груза</div>
        <div className={styles.advantages__item}>Доставка точно в срок</div>
        <div className={styles.advantages__item}>Крупная собственная сеть</div> */}
      </div>

    </section>
  );
}