import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer id="contacts" className={styles.footer}>
      <a href="/Kantar.pdf"
        rel="noopener"
        target="_blank"
      > <div className={styles.footer__copyright}>
          © 2026 KANTAR Logistics
        </div>
      </a>

      <div className={styles.footer__links}>
        <a href="/rkn.pdf"
          rel="noopener"
          target="_blank"        >
          Политика конфиденциальности</a>
        <a href="/policy"
          rel="noopener"
          target="_blank"
        >Пользовательское соглашение</a>
      </div>
    </footer>
  );
}