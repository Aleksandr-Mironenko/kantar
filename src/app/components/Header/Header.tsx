"use client";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import logo from "./photo.png";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = "#calculator_express";

    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const ddd = async () => {
    await fetch('/api/auth/reset-session', { method: 'GET' });
  }


  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper} >
        <nav className={styles.header__nav}>
          <button onClick={() => {
            ddd()
          }}>сброс</button>
          <a className="tn-atom"
            href="https://kantar-logistics.ru/">
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

            <Link href={`/services`}
              className={styles.header__nav_link}
              target="_self"
              rel="noopener"
            >
              УСЛУГИ
            </Link>

            <Link href={`/info`}
              className={styles.header__nav_link}
              target="_self"
              rel="noopener"
            >
              О НАС
            </Link>

            <Link href={`/contacts`}
              className={styles.header__nav_link}
              target="_self"
              rel="noopener"
            >
              КОНТАКТЫ
            </Link>

            <Link
              href="/#calculator"
              onClick={handleScroll}
              className={styles.header__nav_button}
            >
              <div className={styles.header__nav_button_content}>
                <span>КАЛЬКУЛЯТОР</span>
              </div>
            </Link>
          </div>
        </nav>
        {/* 
      <div className={styles.header__phone}>+7 (800) 123-45-67</div> */}
      </div>
    </header>
  );
}