
import findUser from "@/app/api/admin/admin-panel-poling/orders/search-one-order/findUser";
import OrderTable from "@/app/components/OrderTable/OrderTable";
import UserProfile from "@/app/components/UserProfile/UserProfile";
import { toCorrectUserAcc } from "@/app/components/DTO/DTO";
import ThirdPartyFix from "@/app/components/ThirdPartyFix/ThirdPartyFix";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dataUserSendler: toCorrectUserAcc = await findUser(id)
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>

      <ThirdPartyFix />

      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}

      <Header />

      <UserProfile searchParams={{ id, idUserProps: dataUserSendler }} />

      <OrderTable searchParams={{ idUserProps: id, headerPage: `Заказы клиента` }} />;

      <Footer />

    </main>
  )
}