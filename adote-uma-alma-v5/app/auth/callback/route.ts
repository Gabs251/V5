import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "gprocopio2020@gmail.com").toLowerCase();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    const email = (data?.user?.email ?? "").toLowerCase();

    if (!error && email === ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/admin", url.origin));
    }

    // Sessão de qualquer outra conta é terminada de imediato
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/", url.origin));
}
