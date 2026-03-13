import Header from '../../components/Header/Header';
import Services from '../../components/Services/Services';
import Footer from '../../components/Footer/Footer';
import ThirdPartyFix from '../../components/ThirdPartyFix/ThirdPartyFix';

export default function services() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", }}>

      <ThirdPartyFix />

      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}

      <Header />

      <Services all={true} />

      <Footer />

    </section>
  );
}