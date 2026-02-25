// import Image from "next/image";

import Header from '../components/Header/Header';

import Services from '../components/Services/Services';

import Footer from '../components/Footer/Footer';
import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';
export default function Home() {


  return (
    <section style={{
      margin: "auto",
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between'
    }}>
      <ThirdPartyFix />
      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
      <Header />

      <Services all={false} />

      <Footer />
    </section >
  );
}


