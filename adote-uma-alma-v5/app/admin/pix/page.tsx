"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatCents } from "@/lib/currency";
import type { Currency } from "@/lib/types";

interface PixContribution {
  id: string;
  donor_name: string;
  donor_email: string | null;
  amount_cents: number;
  currency: Currency;
  created_at: string;
  souls: { code: string } | null;
}

export default function AdminPixPage() {
  const [items, setItems] = useState<PixContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/pix");
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Erro ao carregar contribuições.");
      setItems(body.contributions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function review(id: string, action: "confirmar" | "rejeitar") {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch("/api/admin/pix", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Não foi possível atualizar.");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-brand-900">Contribuições PIX Pendentes</h1>
        <Link href="/admin" className="text-sm font-medium text-brand-600 hover:text-brand-800">
          ← Voltar ao painel
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-brand-600">A carregar…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl2 border border-brand-100 bg-white p-6 text-sm text-brand-600 shadow-soft">
          Não há contribuições PIX pendentes de momento.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl2 border border-brand-100 bg-white p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-900">{item.donor_name}</p>
                  {item.donor_email && (
                    <p className="text-sm text-brand-600">{item.donor_email}</p>
                  )}
                  <p className="mt-1 text-sm text-brand-600">
                    Alma #{item.souls?.code ?? "—"} ·{" "}
                    {new Date(item.created_at).toLocaleString("pt-PT")}
                  </p>
                </div>
                <p className="text-lg font-bold text-brand-900">
                  {formatCents(item.amount_cents, item.currency)}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => review(item.id, "confirmar")}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => review(item.id, "rejeitar")}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                  Rejeitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
