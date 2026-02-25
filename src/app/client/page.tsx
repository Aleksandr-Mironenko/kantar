
import OrderTable from "@/app/components/OrderTable/OrderTable";
import ServicesAdmin from "@/app/components/ServicesAdmin/ServicesAdmin";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
export default function OrderPage() {


  return (

    <main style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between"
    }
    }>
      <Header />
      <OrderTable searchParams={{ idUserProps: undefined, headerPage: "Админ панель" }} />
      <ServicesAdmin />
      <Footer />
    </main>)
}
