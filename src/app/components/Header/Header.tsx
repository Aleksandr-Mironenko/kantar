import styles from "./Header.module.scss";
import logo from "./photo.png";
import Image from "next/image";


export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper} >
        <nav className={styles.header__nav}>

          <a className="tn-atom" href="https://kantar-logistics.ru/">
            <Image
              className={styles.header__logo}
              src={logo}
              alt="Логотип компании"
              width={171}
              height={60}
              priority // если логотип в хедере — добавь, чтобы не было LCP-пенальти
            />
          </a>
          <div className={styles.header__nav_menu}>
            <a className={styles.header__nav_link} href="#services">
              УСЛУГИ
            </a>
            <a className={styles.header__nav_link} href="#advantages">
              О НАС
            </a>
            <a className={styles.header__nav_link} href="#contacts">
              КОНТАКТЫ
            </a>


            <a href="#calculator" className={styles.header__nav_button}>
              <div className={styles.header__nav_button_content}>
                <span>КАЛЬКУЛЯТОР</span>
              </div>
            </a>

          </div>
        </nav>
        {/* 
      <div className={styles.header__phone}>+7 (800) 123-45-67</div> */}
      </div>
    </header>
  );
}