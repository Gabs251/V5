import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { data: contributions } = await supabase
    .from("contributions")
    .select("*, souls(code)")
    .order("created_at", { ascending: false });

  const header = ["Data", "Alma", "Nome", "Valor (EUR)", "Estado", "Comprovativo"];
  const rows = (contributions ?? []).map((c) => [
    new Date(c.created_at).toLocaleString("pt-PT"),
    c.souls?.code ?? "",
    c.donor_name,
    (c.amount_cents / 100).toFixed(2),
    c.status,
    c.proof_url ?? "",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contribuicoes.csv"`,
    },
  });
}
