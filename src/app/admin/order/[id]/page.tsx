import OrderCopy from "@/app/components/OrderCopy/OrderCopy";

interface Props {
  params: { id: string };
}

export default function OrderPage({ params }: Props) {
  const numberOrder = Number(params.id);

  return <OrderCopy numberOrder={numberOrder} />;
}
