// import { createClient } from "@supabase/supabase-js";

// const supabaseServerPublic = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
// export default supabaseServerPublic




import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default function supabaseServerPublic() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: () => { }
      }
    }
  );
}