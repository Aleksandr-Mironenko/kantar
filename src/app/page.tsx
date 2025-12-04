// import Image from "next/image";

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import WhoWeAre from './components/WhoWeAre/WhoWeAre';
import Services from './components/Services/Services';
import Advantages from './components/Advantages/Advantages';
import Contacts from './components/Contacts/Contacts';
import Footer from './components/Footer/Footer';
import FormCalc from './components/FormCalc/FormCalc'
import CalkSend from './components/CalkSend/CalkSend'
export default function Home() {
  return (
    <>

      <Header />
      <Hero />
      <WhoWeAre />
      <Services />
      <Advantages />
      <FormCalc />
      <Contacts />
      <CalkSend />
      <Footer />
    </>
  );
}


