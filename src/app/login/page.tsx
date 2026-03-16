import Header from '../components/Header/Header';
import LoginForm from '../components/LoginForm/LoginForm';
import Footer from '../components/Footer/Footer';
import ThirdPartyFix from '../components/ThirdPartyFix/ThirdPartyFix';

export const metadata = {
  title: "Вход в личный кабинет | Kantar Logistic",
  robots: "noindex, nofollow",
};

export default function Home() {

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>

      <ThirdPartyFix />

      {/* <RealtimeAdminPanel /> //полностью готов к проду купить доступ и выгрузить папку сервера Render.com */}

      <Header />

      <LoginForm />

      <Footer />
    </main>
  );
}


