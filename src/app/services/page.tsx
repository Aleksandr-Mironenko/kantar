// import Header from '../components/Header/Header';
// import Services from '../components/Services/Services';
// import Footer from '../components/Footer/Footer';
// import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';
// export default function Home() {

//   return (
//     <section style={{ margin: "auto", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>

//       <ThirdPartyFix />

//       {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}

//       <Header />

//       <Services all={false} />

//       <Footer />

//     </section >
//   );
// }


// ssr


import Header from '../components/Header/Header';
import Services from '../components/Services/Services';
import Footer from '../components/Footer/Footer';
import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';

export const metadata = {
  title: "Международные грузоперевозки по Европе — Kantar Logistic",
  description:
    "Международные и внутренние грузоперевозки по России и Европе. Доставка коммерческих и частных грузов.",
  alternates: {
    canonical: "https://kantar-logistics.ru/",
  },
  openGraph: {
    title: "Международные грузоперевозки по Европе — Kantar Logistic",
    description:
      "Международные и внутренние грузоперевозки по России и Европе.",
    url: "https://kantar-logistics.ru/",
    type: "website",
  },
};

export default function Home() {
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
                name: "Как заказать международную грузоперевозку?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Вы можете оставить заявку через сайт или связаться с менеджером по телефону.",
                },
              },
              {
                "@type": "Question",
                name: "В какие страны вы доставляете грузы?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Мы выполняем перевозки по всей Европе, включая Германию, Польшу, Нидерланды, Францию и другие страны.",
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
          {/* H1 можно скрыть визуально, но оставить для SEO */}
          <h1 style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px"
          }}>
            Международные грузоперевозки по Европе
          </h1>

          <Services all={false} />
        </main>

        <Footer />
      </section>
    </>
  );
}