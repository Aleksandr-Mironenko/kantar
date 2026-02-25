import Оrder from '@/app/components/Оrder/Order';

export default async function OrderPage({ params }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const numberOrder = Number(id);

  return <Оrder numberOrder={numberOrder} />;
}