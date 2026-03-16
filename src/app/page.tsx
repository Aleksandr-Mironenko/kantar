// import Header from './components/Header/Header';
// import Hero from './components/Hero/Hero';
// import Footer from './components/Footer/Footer';
// import ThirdPartyFix from './components/ThirdPartyFix/ThirdPartyFix';
// import CalcSend from './components/CalcSend/CalcSend';

// export default function Home() {
//   return (
//     <main style={{
//       minHeight: "100vh", display: "flex", flexDirection: "column",
//     }}>
//       <ThirdPartyFix />
//       {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
//       <Header />
//       <Hero />
//       <CalcSend />
//       <Footer />
//     </main>
//   );
// }


// ssr


import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import ThirdPartyFix from './components/ThirdPartyFix/ThirdPartyFix';
import CalcSend from './components/CalcSend/CalcSend';

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
            url: BASE_URL,
            description:
              "Kantar Logistic — международная логистическая компания, выполняющая грузоперевозки по России, Европе и Азии.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+7-910-105-64-23",
              contactType: "customer service",
              email: "kantarlog@mail.ru",
            },
          }),
        }}
      />

      {/* WebSite + SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: BASE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${BASE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
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
            ],
          }),
        }}
      />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThirdPartyFix />
        {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}

        <Header />

        {/* Скрытый H1 */}
        <h1
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
          }}
        >
          Международные грузоперевозки Kantar Logistic — логистика, доставка грузов, транспортные решения по России, Европе и Азии
        </h1>

        <Hero />
        <CalcSend />

        {/* SEO‑текст на главной (очень полезно) */}
        <section style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "0px", height: "0px", overflow: "hidden" }}>
            Логистическая компания Kantar Logistic — международные перевозки
          </h2>
          <h3 style={{
            fontSize: "16px", lineHeight: "1.6", position: "absolute", left: "-9999px", top: "-9999px",
          }}>
            Kantar Logistic — международная логистическая компания, выполняющая перевозки коммерческих грузов, личных вещей и сборных отправлений по России, Европе и Азии. Мы предлагаем комплексные транспортные решения, включая подбор оптимального маршрута, страхование, таможенное оформление и доставку «до двери».
          </h3>
        </section>

        <Footer />
      </main>
    </>
  );
}
