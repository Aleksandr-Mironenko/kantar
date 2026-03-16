// // import Image from "next/image";

// import Header from '../components/Header/Header';
// import WhoWeAre from '../components/WhoWeAre/WhoWeAre';
// // import Services from './components/Services/Services';
// import Advantages from '../components/Advantages/Advantages';
// import Footer from '../components/Footer/Footer';
// // import FormCalc from './components/FormCalc/FormCalc'
// import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';
// // import RealtimeAdminPanel from './components/RealtimeAdminPanel/RealtimeAdminPanel' //полностью котов к проду купить доступ и выгрузить папку сервера Render.com
// export default function Home() {


//   return (
//     <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>

//       <ThirdPartyFix />
//       {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
//       <Header />

//       <WhoWeAre />

//       <Advantages />

//       <Footer />
//     </main>
//   );
// }


// import Image from "next/image";

import Header from '../components/Header/Header';
import WhoWeAre from '../components/WhoWeAre/WhoWeAre';
import Advantages from '../components/Advantages/Advantages';
import Footer from '../components/Footer/Footer';
import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      {/* Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kantar Logistic — Кантар Логистик",
            url: "https://kantar-logistics.ru/",
            description:
              "Kantar Logistic — международная логистическая компания, специализирующаяся на перевозках по России, Европе и Азии.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+7-910-105-64-23",
              contactType: "customer service",
              email: "kantarlog@mail.ru",
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: `${BASE_URL}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "О нас",
                item: `${BASE_URL}/info`,
              },
            ],
          }),
        }}
      />

      {/* FAQ — тематический, один */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Чем занимается Kantar Logistic?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Мы специализируемся на международных грузоперевозках, логистике и доставке коммерческих грузов по России, Европе и Азии.",
                },
              },
              {
                "@type": "Question",
                name: "В каких странах вы работаете?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Мы выполняем перевозки по всей Европе, странам СНГ, России и Азии.",
                },
              },
              {
                "@type": "Question",
                name: "Какие грузы вы перевозите?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Мы перевозим коммерческие грузы, личные вещи, сборные грузы, оборудование и товары для бизнеса.",
                },
              },
            ],
          }),
        }}
      />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <ThirdPartyFix />
        <Header />

        {/* Скрытый H1 */}
        <h1
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
          }}
        >
          Kantar Logistic — международные грузоперевозки, логистика и доставка коммерческих грузов по России, Европе, Азии и миру.
        </h1>

        <WhoWeAre />
        <Advantages />
        <Footer />
      </main>
    </>
  );
}
