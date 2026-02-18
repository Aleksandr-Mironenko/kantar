// import Image from "next/image";

import Header from '../components/Header/Header';
// import Services from './components/Services/Services';
import Contacts from '../components/Contacts/Contacts';
import Footer from '../components/Footer/Footer';
// import FormCalc from './components/FormCalc/FormCalc'
import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';
// import RealtimeAdminPanel from './components/RealtimeAdminPanel/RealtimeAdminPanel' //полностью котов к проду купить доступ и выгрузить папку сервера Render.com
export default function Home() {


  return (
    <main style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
    }}>
      <ThirdPartyFix />
      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
      <Header />

      <Contacts />

      <Footer />
    </main>
  );
} 