import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer id="contacts" className={styles.footer}>
      <div className={styles.footer__copyright}>
        © 2025 KANTAR Logistics
      </div>

      <div className={styles.footer__links}>
        <a href="#">Политика конфиденциальности</a>
        <a href="#">Пользовательское соглашение</a>
      </div>
    </footer>
  );
}