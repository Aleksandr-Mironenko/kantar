import Header from '../../components/Header/Header'
import readOneServices from '@/app/api/admin/admin-panel-poling/services-admin/get-one/readOneService'
import ServicePage from '../../components/ServicePage/ServicePage'
import Footer from '../../components/Footer/Footer'

export default async function FirstService({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const service = await readOneServices(id)

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
    }}>

      <Header />
      <ServicePage service={service} />
      <Footer />
    </section>
  )
}