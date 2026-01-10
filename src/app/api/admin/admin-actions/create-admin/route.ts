import bcrypt from 'bcrypt';
import supabaseServer from '../../../lib/supabase/server-public';



export async function POST(req: Request) {
  const { login_admin, password, name_admin, phone_admin } = await req.json();
  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabaseServer
    .from('admins')
    .insert({ login_admin, password_hash, name_admin, phone_admin, admin_status: 'no_work' });
  if (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 403 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}