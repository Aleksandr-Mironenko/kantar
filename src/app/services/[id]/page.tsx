// import Header from '../../components/Header/Header'
// import readOneServices from '@/app/api/admin/admin-panel-poling/services-admin/get-one/readOneService'
// import ServicePage from '../../components/ServicePage/ServicePage'
// import Footer from '../../components/Footer/Footer'

// export default async function FirstService({ params }: { params: Promise<{ name_of_service: string }> }) {
//   const {name_of_service } = await params
//   const service = await readOneServices(name_of_service)

//   return (
//     <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", }}>

//       <Header />

//       <ServicePage service={service} />

//       <Footer />

//     </section>
//   )
// }


// SSR


import Header from '../../components/Header/Header'
import readOneServices from '@/app/api/admin/admin-panel-poling/services-admin/get-one/readOneService'
import ServicePage from '../../components/ServicePage/ServicePage'
import Footer from '../../components/Footer/Footer'

export default async function FirstService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await readOneServices(id)
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
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
                item: `${BASE_URL}/`
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Услуги",
                item: `${BASE_URL}/services`
              },
              {
                "@type": "ListItem",
                position: 3,
                name: service.name,
                item: `${BASE_URL}/services/${id}`
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

      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <main>
          {/* Скрытый H1 — обязателен для SEO */}
          <h1
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
            }}
          >
            {service.name} — транспортная услуга компании Kantar Logistic
          </h1>

          <ServicePage service={service} />
        </main>

        <Footer />
      </section>
    </>
  )
}
