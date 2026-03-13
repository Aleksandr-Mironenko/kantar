import Footer from '@/app/components/Footer/Footer';
import Header from '@/app/components/Header/Header';
import Оrder from '@/app/components/Оrder/Order';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numberOrder = Number(id);
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>

      <Header />

      <Оrder numberOrder={numberOrder} />

      <Footer />

    </main>);
}