
import { ServicesAdminType } from '@/app/components/DTO/DTO'
export default async function ServicePage({ service }: { service: ServicesAdminType }) {

  return (
    <section style={{ minHeight: "85vh" }}>
      <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", margin: "40px", padding: "40px", borderRadius: "20px" }}>
        <h1 style={{ margin: "20px auto" }}>{service.name}</h1>
        <p>{service.full_description}</p>
      </div>

    </section>

  )
}