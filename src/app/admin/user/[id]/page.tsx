
import findUser from "@/app/api/admin/admin-panel-poling/orders/search-one-order/findUser";
import PolingeAdminPanel from "@/app/components/PolingAdminPanel/PolingAdminPanel";
import UserProfile from "@/app/components/UserProfile/UserProfile";
import { toCorrectUserAcc, CommentUserType } from "@/app/components/DTO/DTO";
import readComment from '@/app/api/admin/admin-panel-poling/users/comment-In_user/get/readComment'

export default async function OrderPage({ params }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dataUserSendler: toCorrectUserAcc = await findUser(id)
  // const comments: CommentUserType[] = await readComment(idUser)
  return (<>
    <UserProfile
      searchParams={{ id, idUserProps: dataUserSendler }}

    />
    <PolingeAdminPanel searchParams={{ idUserProps: id, headerPage: `Заказы клиента` }} />;
  </>)
}
