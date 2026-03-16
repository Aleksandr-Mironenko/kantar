// import Header from '../components/Header/Header';
// import Contacts from '../components/Contacts/Contacts';
// import Footer from '../components/Footer/Footer';
// import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';

// export default function Home() {
//   return (
//     <main style={{
//       minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between'
//     }}>
//       <ThirdPartyFix />
//       {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
//       <Header />

//       <Contacts />

//       <Footer />
//     </main>
//   );
// } 

// ssr



import Header from '../components/Header/Header';
import Contacts from '../components/Contacts/Contacts';
import Footer from '../components/Footer/Footer';
import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return (<>
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
              item: `${BASE_URL}/`
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Контакты",
              item: `${BASE_URL}/contacts`
            },

          ]
        })
      }}
    />

    {/* Schema.org FAQ (общий для всех услуг) */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Как заказать услугу?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Вы можете оставить заявку на сайте или связаться с менеджером по телефону.",
              },
            },
            {
              "@type": "Question",
              name: "Сколько стоит перевозка?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Стоимость рассчитывается индивидуально и зависит от маршрута, веса и типа груза.",
              },
            },
          ],
        }),
      }}
    />

    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between'
    }}>
      <ThirdPartyFix />
      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
      <Header />

      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        }}
      >
        Контакты Kantar Logistic — как связаться с международной логистической компанией
      </h1>

      <Contacts />

      <Footer />
    </section>
  </>
  );
} 