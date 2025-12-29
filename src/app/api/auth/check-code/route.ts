import supabaseServer from '../lib/supabase/server'

export async function POST(req: Request) {
  const { phone, code } = await req.json();

  const { data } = await supabaseServer
    .from("auth_codes")
    .select("*")
    .eq("phone", phone)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!data) {
    return Response.json({ ok: false }, { status: 401 });
  }

  await supabaseServer
    .from("auth_codes")
    .update({ is_check: true })
    .eq("id", data.id);

  return Response.json({ ok: true });
}