import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Lista as contribuições PIX pendentes de aprovação.
export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("contributions")
    .select("id, donor_name, donor_email, amount_cents, currency, created_at, souls(code)")
    .eq("payment_method", "pix")
    .eq("status", "pendente")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Erro ao carregar contribuições." }, { status: 500 });
  }

  return NextResponse.json({ contributions: data ?? [] });
}

// Confirma ou rejeita uma contribuição PIX pendente.
// Ao confirmar, o trigger da base de dados soma o valor (convertido à taxa fixa
// 110 € = 635 R$) ao arrecadado da alma e atualiza a barra de progresso.
export async function PATCH(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  const action =
    body?.action === "confirmar" || body?.action === "rejeitar" ? body.action : null;

  if (!id || !action) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("contributions")
    .update({ status: action === "confirmar" ? "confirmada" : "rejeitada" })
    .eq("id", id)
    .eq("payment_method", "pix")
    .eq("status", "pendente");

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível atualizar a contribuição." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
