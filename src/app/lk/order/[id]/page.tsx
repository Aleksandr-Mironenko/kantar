import Footer from '@/app/components/Footer/Footer';
import Header from '@/app/components/Header/Header';
import ОrderClient from '@/app/components/ОrderClient/ОrderClient';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numberOrder = Number(id);
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>

      <Header />

      <ОrderClient numberOrder={numberOrder} />

      <Footer />

    </main>);
}