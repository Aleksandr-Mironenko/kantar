import ОrderClient from '@/app/components/ОrderClient/ОrderClient';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numberOrder = Number(id);
  return <ОrderClient numberOrder={numberOrder} />
}