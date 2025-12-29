import supabaseServer from '../lib/supabase/server'

export async function POST(req: Request) {
  const { phone, email } = await req.json();

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await supabaseServer
    .from("auth_codes")
    .insert({
      phone,
      email,
      code,
      is_entry: false,
      is_check: false,
      expires_at: new Date(Date.now() + 10 * 60 * 1000)
    });

  return Response.json({ sendCode: "ok" });
}