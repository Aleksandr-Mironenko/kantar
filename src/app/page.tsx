// import Image from "next/image";

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
// import WhoWeAre from './components/WhoWeAre/WhoWeAre';
// import Services from './components/Services/Services';
// import Advantages from './components/Advantages/Advantages';
// import Contacts from './components/Contacts/Contacts';
import Footer from './components/Footer/Footer';
// import FormCalc from './components/FormCalc/FormCalc'
// import CalkSendExpress from './components/CalkSendExpress/CalkSendExpress'
import ThirdPartyFix from './components/ThirdPartyFix/ThirdPartyFix';
// import CooperationRequestForm from './components/CooperationRequestForm/CooperationRequestForm'
// import CalkSendLong from './components/CalkSendLong/CalkSendLong';
import CalcSend from './components/CalcSend/CalcSend';
// import RealtimeAdminPanel from './components/RealtimeAdminPanel/RealtimeAdminPanel' //полностью котов к проду купить доступ и выгрузить папку сервера Render.com
export default function Home() {


  return (
    <main style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
    }}>
      <ThirdPartyFix />
      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
      <Header />
      <Hero />
      {/* <WhoWeAre /> */}
      {/* <Services />*/}
      {/* <Advantages /> */}
      {/* <FormCalc /> */}{/* форма запрос на персональный рассчет - не нужна */}
      {/* <Contacts /> */}
      {/* <CalkSendExpress /> */}
      {/*<CooperationRequestForm /> сделать условным по запросу типа внутри аккаунта
      нахождение под авторизацией клиента */}
      {/* <CalkSendLong /> */}
      <CalcSend />
      <Footer />
    </main>
  );
}


