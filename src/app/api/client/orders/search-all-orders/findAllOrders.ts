import supabaseServer from '@/app/api/lib/supabase/server-public';

export default async function findAllOrders(request: Request) {
  const supabaseServers = supabaseServer();
  const { searchParams } = new URL(request.url);



  const session = await supabaseServers.auth.getSession();
  console.log(session.data.session?.access_token);

  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Number(searchParams.get('limit') ?? 10));

  const offset = (page - 1) * limit;
  const from = offset;
  const to = offset + limit - 1;

  const { data: user } = await supabaseServers.auth.getUser();
  console.log("AUTH USER ID:", user?.user?.id);

  const sessionsss = await supabaseServers.auth.getSession();
  console.log("sessionss", sessionsss.data.session?.access_token);

  const { data: arrayOrderObjData, error, count } = await supabaseServers
    .from("orders")
    .select("*", { count: 'exact' })
    .order('order_number', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }

  const totalPages = Math.ceil((count ?? 0) / limit);

  return { arrayOrderObjData, count, page, limit, totalPages };
}