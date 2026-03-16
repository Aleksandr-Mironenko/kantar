"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./LoginBlock.module.scss";

export default function LoginBlock() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

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

    loggedIn ?
      <div className={styles.loginWrapper
      } >
        <div className={styles.header__nav_button}
        >
          <span className={styles.defaultText}>ЛИЧНЫЙ КАБИНЕТ</span>

          <div className={styles.hoverLinks}>
            <Link href="/login"  >В АККАУНТ</Link>
            <button onClick={() => { exitLogin() }} className={styles.header__nav_button_content}>ВЫХОД</button>
          </div>
        </div>
      </div >
      :
      <div className={styles.loginWrapper}>
        <div
          className={styles.header__nav_button}

        >
          <span className={styles.defaultText}>ЛИЧНЫЙ КАБИНЕТ</span>

          <div className={styles.hoverLinks}>
            <Link href="/register">РЕГИСТРАЦИЯ</Link>
            <Link href="/login">ВХОД</Link>
          </div>
        </div>
      </div>

  )
}