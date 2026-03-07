// import { createClient } from '@supabase/supabase-js';

// export async function GET() {
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );

//   // Полный сброс всех сессий
//   await supabase.auth.signOut({ scope: 'global' });

//   return new Response('Signed out globally');
// }



// ---------------------------------------------------



// import { createClient } from '@supabase/supabase-js';

// export async function GET() {
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );

//   // Удаляем серверную сессию
//   await supabase.auth.signOut({ scope: 'global' });

//   // Удаляем клиентские куки Supabase
//   const headers = new Headers();

//   headers.append(
//     "Set-Cookie",
//     "sb-access-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
//   );

//   headers.append(
//     "Set-Cookie",
//     "sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
//   );

//   return new Response("Signed out globally", { headers });
// }



//---------------------------------------------------



import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.auth.signOut({ scope: 'global' });

  const headers = new Headers();

  headers.append(
    "Set-Cookie",
    "sb-pyzpdyaqsrbgstfdlycz-auth-token=; Path=/; Domain=localhost; Max-Age=0; SameSite=Lax"
  );

  return new Response("Signed out globally", { headers });
}
