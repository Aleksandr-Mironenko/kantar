import Order from "@/app/components/Оrder/Order";

interface Props {
  params: { id: string };
}

export default function OrderPage({ params }: Props) {
  const orderId = Number(params.id);

  return <Order orderId={orderId} />;
}
