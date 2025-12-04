import styles from './Contacts.module.scss'


export default function Contacts() {
  return (
    <section id="contacts" className={styles.contacts}  >
      <div className={styles.contacts__container} >
        <h1
          className={styles.contacts__title}
        >Контакты
        </h1>
        <p>
          <a className={styles.contacts__button}
            href="tel:+79101056423"
          >
            Телефон: +7 (910) 105-64-23
          </a>
        </p>
        <p>
          <a
            className={styles.contacts__button}
            href={`mailto:kantarlog@mail.ru`}
          >
            Email: kantarlog@mail.ru
          </a>
        </p>

      </div>
    </section>
  )
}