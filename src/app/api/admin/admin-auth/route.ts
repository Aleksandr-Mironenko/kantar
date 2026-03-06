import supabaseServer from '../../lib/supabase/server-public';
import bcrypt from 'bcrypt';

// POST /api/admin/login
export async function POST(req: Request) {
  const supabaseServers = supabaseServer();
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // ищем админа по email
    const { data: admin, error } = await supabaseServers
      .from('admins')
      .select('*')
      .eq('login_admin', email)
      .single();

    if (!admin) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Admin not found' }),
        { status: 401 }
      );
    }

    // проверяем пароль
    const passwordMatches = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatches) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid password' }),
        { status: 401 }
      );
    }

    // обновляем статус admin_status →  work
    const { error: updateError } = await supabaseServers
      .from('admins').update({ admin_status: 'work' })
      .eq('id', admin.id);
    if (updateError) {
      console.error(updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to update admin status' }),
        { status: 500 });
    }

    // Возвращаем нужные поля
    return new Response(
      JSON.stringify({
        ok: true,
        admin: {
          id: admin.id,
          login_admin: admin.login_admin,
          name_admin: admin.name_admin,
          phone_admin: admin.phone_admin,
          email_admin: admin.login_admin,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Server error' }),
      { status: 500 }
    );
  }
}