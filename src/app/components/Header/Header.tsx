
// import styles from "./Header.module.scss";
// import logo from "./photo.png";
// import Image from "next/image";
// import Link from "next/link";
// import CalkulatorButton from "../CalkulatorButton/CalkulatorButton";
// import LoginBlock from "../LoginBlock/LoginBlock";

// export default function Header() {

//   return (
//     <header className={styles.header}>
//       <div className={styles.header__wrapper} >
//         <nav className={styles.header__nav}>

//           <a className="tn-atom"
//             href="https://kantar-logistics.ru/">
//             <Image
//               className={styles.header__logo}
//               src={logo}
//               alt="Логотип компании"
//               width={171}
//               height={60}
//               priority // если логотип в хедере — добавь, чтобы не было LCP-пенальти
//             />
//           </a>
//           <div className={styles.header__nav_menu}>

//             <Link href={`/services`}
//               className={styles.header__nav_link}
//               target="_self"
//               rel="noopener"
//             >
//               УСЛУГИ
//             </Link>

//             <Link href={`/info`}
//               className={styles.header__nav_link}
//               target="_self"
//               rel="noopener"
//             >
//               О НАС
//             </Link>

//             <Link href={`/contacts`}
//               className={styles.header__nav_link}
//               target="_self"
//               rel="noopener"
//             >
//               КОНТАКТЫ
//             </Link>

//             <CalkulatorButton />

//             <LoginBlock />
//           </div>
//         </nav>
//       </div >
//     </header >
//   );
// }

// ssr


import styles from "./Header.module.scss";
import logo from "./photo.png";
import Image from "next/image";
import Link from "next/link";
import CalkulatorButton from "../CalkulatorButton/CalkulatorButton";
import LoginBlock from "../LoginBlock/LoginBlock";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper}>
        <nav className={styles.header__nav}>
          <a className="tn-atom" href="https://kantar-logistics.ru/">
            <Image
              className={styles.header__logo}
              src={logo}
              alt="Логотип компании"
              width={171}
              height={60}
              priority
            />
          </a>

          <div className={styles.header__nav_menu}>
            <Link href="/services" className={styles.header__nav_link}>
              УСЛУГИ
            </Link>

            <Link href="/info" className={styles.header__nav_link}>
              О НАС
            </Link>

            <Link href="/contacts" className={styles.header__nav_link}>
              КОНТАКТЫ
            </Link>

            {/* Клиентский компонент — плавный скролл */}
            <div className={styles.header__nav_link}>
              <CalkulatorButton />
            </div>


            {/* Клиентский компонент — логин/логаут */}
            <LoginBlock />
          </div>
        </nav>
      </div>
    </header>

  );
}