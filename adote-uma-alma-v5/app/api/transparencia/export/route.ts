import { NextResponse } from "next/server";
import { getSouls, getConfirmedContributions } from "@/lib/data";

export async function GET() {
  const [souls, history] = await Promise.all([getSouls(), getConfirmedContributions(1000)]);

  const lines: string[] = [];
  lines.push("Resumo por alma");
  lines.push('"Alma","Pais","Meta (EUR)","Arrecadado (EUR)","Percentagem"');
  for (const s of souls) {
    const pct = s.goal_cents > 0 ? Math.round((s.raised_cents / s.goal_cents) * 100) : 0;
    lines.push(
      '"Alma #' + s.code + '","' + s.country + '","' + (s.goal_cents / 100).toFixed(2) +
        '","' + (s.raised_cents / 100).toFixed(2) + '","' + pct + '%"'
    );
  }

  lines.push("");
  lines.push("Contribuicoes confirmadas");
  lines.push('"Data","Alma","Nome","Valor (EUR)"');
  for (const c of history) {
    const name = c.donor_name.split('"').join('""');
    lines.push(
      '"' + new Date(c.created_at).toLocaleString("pt-PT") + '","' +
        (c.soul_code ? "Alma #" + c.soul_code : "") + '","' + name + '","' +
        (c.amount_cents / 100).toFixed(2) + '"'
    );
  }

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="transparencia.csv"',
    },
  });
}
