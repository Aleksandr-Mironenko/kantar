
import PolingeAdminPanel from "@/app/components/PolingAdminPanel/PolingAdminPanel";

export default async function OrderPage({ params }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const idUser = id;


  return (<>

    <PolingeAdminPanel searchParams={{ idUserProps: idUser, headerPage: `Заказы пользователя с id ${idUser}` }} />;
  </>)
}
