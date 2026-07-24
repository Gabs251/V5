import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSoulById } from "@/lib/data";
import type { Currency } from "@/lib/types";

function emailValid(value: string): boolean {
  const at = value.indexOf("@");
  if (at < 1) return false;
  const domain = value.slice(at + 1);
  return domain.includes(".") && domain.length >= 3 && !value.includes(" ");
}

// Regista uma contribuição PIX como pendente de aprovação pelo administrador.
// Nenhum valor é contabilizado automaticamente — só após confirmação no admin.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const soulId = typeof body?.soul_id === "string" ? body.soul_id : null;
  const donorName = typeof body?.donor_name === "string" ? body.donor_name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const amountCents = Number.isInteger(body?.amount_cents) ? body.amount_cents : 0;
  const currency: Currency = body?.currency === "BRL" ? "BRL" : "EUR";

  if (!soulId || donorName.length < 2 || amountCents < 100 || amountCents > 1000000) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (!emailValid(email)) {
    return NextResponse.json({ error: "Indique um email válido." }, { status: 400 });
  }

  const soul = await getSoulById(soulId);
  if (!soul) {
    return NextResponse.json({ error: "Alma não encontrada." }, { status: 404 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contributions").insert({
    soul_id: soulId,
    donor_name: donorName,
    donor_email: email,
    amount_cents: amountCents,
    currency: currency,
    payment_method: "pix",
    status: "pendente",
    admin_note: "PIX — aguarda confirmação do administrador",
  });

  if (error) {
    console.error("Erro Supabase:", error);
    return NextResponse.json(
      { error: "Não foi possível registar a contribuição." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
