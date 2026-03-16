// import Header from '../../components/Header/Header';
// import Services from '../../components/Services/Services';
// import Footer from '../../components/Footer/Footer';
// import ThirdPartyFix from '../../components/ThirdPartyFix/ThirdPartyFix';

// export default function services() {
//   return (
//     <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", }}>

//       <ThirdPartyFix />

//       {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}

//       <Header />

//       <Services all={true} />

//       <Footer />

//     </section>
//   );
// }

// SSR


import Header from '../../components/Header/Header';
import Services from '../../components/Services/Services';
import Footer from '../../components/Footer/Footer';
import ThirdPartyFix from '../../components/ThirdPartyFix/ThirdPartyFix';

export const metadata = {
  title: "Международные грузоперевозки по Европе — Kantar Logistic",
  description:
    "Международные и внутренние грузоперевозки по России, Европе, Азии и миру. Доставка коммерческих и частных грузов.",
  alternates: {
    canonical: "https://kantar-logistics.ru/",
  },
  openGraph: {
    title: "Международные грузоперевозки по Миру — Kantar Logistic",
    description:
      "Международные и внутренние грузоперевозки по России, Европе, Азии и миру.",
    url: "https://kantar-logistics.ru/",
    type: "website",
  },
};
export default function ServicesPage() {
  return (
    <>

      {/* Schema.org FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Какие услуги вы предоставляете?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Мы предоставляем международные перевозки, доставку личных вещей, коммерческих грузов, сборные перевозки и другие логистические услуги.",
                },
              },
              {
                "@type": "Question",
                name: "Можно ли заказать перевозку по Европе?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Да, мы выполняем перевозки по всей Европе, включая Германию, Польшу, Нидерланды, Францию, Чехию и другие страны.",
                },
              },
            ],
          }),
        }}
      />
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
                item: "https://kantar-logistics.ru/"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Услуги",
                item: "https://kantar-logistics.ru/services"
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Все услуги",
                item: "https://kantar-logistics.ru/services/all"
              }
            ]
          })
        }}
      />

      <section
        style={{
          margin: "auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}

      >
        <ThirdPartyFix />
        <Header />

        <main>
          {/* Скрытый H1 — обязателен для SEO, но не виден пользователю */}
          <h1
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
            }}
          >
            Все транспортные услуги компании
          </h1>

          <Services all={true} />
        </main>

        <Footer />
      </section>
    </>
  );
}