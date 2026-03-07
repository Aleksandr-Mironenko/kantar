// import Image from "next/image";

import Header from '../components/Header/Header';
// import WhoWeAre from '../components/WhoWeAre/WhoWeAre';
// import Services from './components/Services/Services';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import Footer from '../components/Footer/Footer';
// import FormCalc from './components/FormCalc/FormCalc'
import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';
// import RealtimeAdminPanel from './components/RealtimeAdminPanel/RealtimeAdminPanel' //полностью котов к проду купить доступ и выгрузить папку сервера Render.com
export default function Home() {


  return (
    <section style={{
      margin: "auto",
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between'
    }}>
      <ThirdPartyFix />
      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
      <Header />

      <RegisterForm />

      <Footer />
    </section>
  );
}


