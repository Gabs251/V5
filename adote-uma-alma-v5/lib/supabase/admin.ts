import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com Service Role Key — usar APENAS em route handlers/server actions
// que já validaram a sessão de administrador. Nunca expor ao browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
