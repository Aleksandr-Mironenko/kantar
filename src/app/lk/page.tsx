
import findUser from "@/app/api/client/orders/search-one-order/findUser";
import supabaseServer from '@/app/api/lib/supabase/server-public';
// import OrderTable from "@/app/components/OrderTable/OrderTable";
// import UserProfile from "@/app/components/UserProfile/UserProfile";
import { toCorrectUserAcc, CommentUserType } from "@/app/components/DTO/DTO";
// import readComment from '@/app/api/admin/admin-panel-poling/users/comment-In_user/get/readComment'
import UserProfileClient from "@/app/components/UserProfileClient/UserProfileClient";
import OrderTableClient from "@/app/components/OrderTableClient/OrderTableClient";
import ThirdPartyFix from "../components/ThirdPartyFix/ThirdPartyFix";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CooperationRequestForm from "../components/CooperationRequestForm/CooperationRequestForm";

export default async function LcPage() {
  // const { id } = await params;
  const supabaseServers = supabaseServer();
  const { data: session } = await supabaseServers.auth.getSession();

  const jwt = session?.session?.access_token;
  const payload = jwt ? JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString()) : null;

  console.log("JWT USER_ID:", payload.user_id);

  const id = payload.user_id;


  const dataUserSendler: toCorrectUserAcc = await findUser(id)
  // const comments: CommentUserType[] = await readComment(idUser)
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>

      <ThirdPartyFix />
      {/* <RealtimeAdminPanel /> //полностью котов к проду купить доступ и выгрузить папку сервера Render.com */}
      <Header />



      <UserProfileClient
        searchParams={{ id, idUserProps: dataUserSendler }}

      />
      {!dataUserSendler.is_dogovor && <CooperationRequestForm />}

      <OrderTableClient searchParams={{ idUserProps: id, headerPage: `Ваши заказы` }} />;

      <Footer />
    </main>
  )
} 