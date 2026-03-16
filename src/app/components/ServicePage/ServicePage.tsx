
// import { ServicesAdminType } from '@/app/components/DTO/DTO'
// export default async function ServicePage({ service }: { service: ServicesAdminType }) {

//   return (
//     <section style={{ minHeight: "85vh" }}>
//       <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", margin: "40px", padding: "40px", borderRadius: "20px" }}>
//         <h1 style={{ margin: "20px auto" }}>{service.name}</h1>
//         <p>{service.full_description}</p>
//       </div>

//     </section>

//   )
// }

// SSR

import { ServicesAdminType } from '@/app/components/DTO/DTO'

export const generateMetadata = ({ service }: { service: ServicesAdminType }) => {
  return {
    title: `${service.name} — Kantar Logistic`,
    description: service.full_description?.slice(0, 160) || service.description
  }
}

export default function ServicePage({ service }: { service: ServicesAdminType }) {
  return (
    <>
      {/* Schema.org Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.full_description || service.description,
            url: `https://kantar-logistics.ru/services/${service.url_vizual_name}`,
            provider: {
              "@type": "Organization",
              name: "Kantar Logistic — Кантар Логистик",
              url: "https://kantar-logistics.ru/"
            },
            areaServed: "Europe",
            image: service.url_image_signed
          }),
        }}
      />

      <section style={{ minHeight: "85vh" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            margin: "40px",
            padding: "40px",
            borderRadius: "20px"
          }}
        >
          {/* Визуальный заголовок — теперь H2 */}
          <h2 style={{ margin: "20px auto" }}>{service.name}</h2>

          <p>{service.full_description}</p>
        </div>
      </section>
    </>
  )
}
