// "use client"
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import styles from "./CalkulatorButton.module.scss";


// export default function CalkulatorButton() {
//   const pathname = usePathname();

//   const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     const hash = "#calculator_express";

//     if (pathname === "/") {
//       e.preventDefault();
//       const el = document.querySelector(hash);
//       if (el) el.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (<Link
//     href="/#calculator"
//     onClick={handleScroll}
//     className={styles.header__nav_button}
//   >
//     <div className={styles.header__nav_button_content}>
//       <span>КАЛЬКУЛЯТОР</span>
//     </div>

//   </Link>)

// }


"use client"
import styles from "./CalkulatorButton.module.scss";
import { useEffect, useState } from "react";
// import Link from "next/link";

export default function CalkulatorButton() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null; // ← сервер ничего не рендерит

  const handleScroll = () => {
    const el = document.querySelector("#calculator_express");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href="/#calculator_express" onClick={handleScroll} className={styles.header__nav_button}>
      КАЛЬКУЛЯТОР
    </a>
  );
}
