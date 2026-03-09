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


import { cookies } from "next/headers";
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.auth.signOut({ scope: 'global' });

  const headers = new Headers();

  for (const c of cookieStore.getAll()) {
    if (c.name.startsWith("sb-") && c.name.includes("auth-token")) {
      headers.append("Set-Cookie", `${c.name}=; Path=/; Max-Age=0`);
    }
  }

  return new Response("Signed out globally", { headers });
}
