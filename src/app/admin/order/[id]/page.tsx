import OrderCopy from "@/app/components/OrderCopy/OrderCopy";

export default async function OrderPage({ params }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const numberOrder = Number(id);

  return <OrderCopy numberOrder={numberOrder} />;
}