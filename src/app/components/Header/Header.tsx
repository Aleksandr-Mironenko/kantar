"use client";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import burger from "@../public/burger.svg";
import logo from "./photo.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const pathname = usePathname();
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = "#calculator_express";

    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const exitLogin = async () => {
    const res = await fetch('/api/auth/reset-session', { method: 'GET' });
    if (res.ok) {
      window.location.href = "/";
    }
  }
  useEffect(() => {
    fetch("/api/auth/status", { credentials: "include" })
      .then(res => res.json())
      .then(data => setLoggedIn(data.loggedIn));
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper} >
        <nav className={styles.header__nav}>

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
            {loggedIn ?
              <div className={styles.loginWrapper}>
                <button className={styles.header__nav_button}
                >
                  <span className={styles.defaultText}>ЛИЧНЫЙ КАБИНЕТ</span>

                  <div className={styles.hoverLinks}>
                    <Link href="/login"  >В АККАУНТ</Link>
                    <button onClick={() => { exitLogin() }} className={styles.header__nav_button_content}>ВЫХОД</button>
                  </div>
                </button>
              </div>
              :
              <div className={styles.loginWrapper}>
                <button
                  className={styles.header__nav_button}

                >
                  <span className={styles.defaultText}>ЛИЧНЫЙ КАБИНЕТ</span>

                  <div className={styles.hoverLinks}>
                    <Link href="/register">РЕГИСТРАЦИЯ</Link>
                    <Link href="/login">ВХОД</Link>
                  </div>
                </button>
              </div>
            }

          </div>
        </nav>
        {/* 
      <div className={styles.header__phone}>+7 (800) 123-45-67</div> */}
      </div >
    </header >
  );
}