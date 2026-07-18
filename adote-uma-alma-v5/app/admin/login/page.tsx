"use client";

import { useState } from "react";
import { Loader2, Apple } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    setError(null);
    setLoading(provider);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/auth/callback" },
    });
    if (oauthError) {
      setError("Não foi possível iniciar a sessão. Tente novamente.");
      setLoading(null);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-xl2 border border-brand-100 bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-brand-900">Área Reservada</h1>
          <p className="mt-1 text-sm text-brand-500">
            Acesso restrito ao administrador do projeto.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google")}
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-3 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-50 focus-ring disabled:opacity-50"
          >
            {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continuar com Google
          </button>
          <button
            onClick={() => signIn("apple")}
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-800 focus-ring disabled:opacity-50"
          >
            {loading === "apple" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Apple className="h-4 w-4" />}
            Continuar com Apple
          </button>
        </div>

        {error && <p className="mt-4 text-center text-sm text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
