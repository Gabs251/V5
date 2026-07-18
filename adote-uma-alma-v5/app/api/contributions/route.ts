import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contributionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contributionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: soul, error: soulError } = await supabase
    .from("souls")
    .select("id, status")
    .eq("id", parsed.data.soul_id)
    .single();

  if (soulError || !soul) {
    return NextResponse.json({ error: "Alma não encontrada." }, { status: 404 });
  }

  const { error } = await supabase.from("contributions").insert({
    soul_id: parsed.data.soul_id,
    donor_name: parsed.data.donor_name,
    amount_cents: parsed.data.amount_cents,
    proof_url: parsed.data.proof_url,
    status: "pendente",
  });

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível registar a contribuição." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
