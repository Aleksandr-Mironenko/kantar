import { createClient } from "@supabase/supabase-js";
//функция предоставляющая доступ к supabase с правами серверного ключа
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default supabaseServer 