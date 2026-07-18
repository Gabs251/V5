import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { StatsGrid } from "@/components/site/StatsGrid";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TransparencyChart } from "@/components/site/TransparencyChart";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { getSouls, getTransparencyTotals, getConfirmedContributions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Transparência",
  description:
    "Veja em tempo real o total arrecadado, o número de almas e contribuições confirmadas.",
};

export const revalidate = 0;

export default async function TransparenciaPage() {
  const [souls, totals, history] = await Promise.all([
    getSouls(),
    getTransparencyTotals(),
    getConfirmedContributions(50),
  ]);

  const stats = [
    { label: "Total arrecadado", value: formatCurrency(totals.totalRaisedCents / 100) },
    { label: "Número de almas", value: String(totals.soulsCount) },
    { label: "Contribuições confirmadas", value: String(totals.contributionsCount) },
    { label: "Meta geral", value: formatCurrency(totals.totalGoalCents / 100) },
  ];

  const chartData = souls.map((s) => ({
    nome: "Alma #" + s.code,
    Arrecadado: s.raised_cents / 100,
    Meta: s.goal_cents / 100,
  }));

  return (
    <>
      <Section className="pb-0">
        <SectionHeading
          eyebrow="Transparência"
          title="Contas claras, corações em paz."
          description="Cada contribuição confirmada é refletida aqui. Nada é assumido automaticamente — só o que a nossa equipa valida manualmente."
        />
        <StatsGrid stats={stats} />
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl rounded-xl2 border border-brand-100 bg-white p-8 shadow-soft">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="font-semibold text-brand-900">Progresso geral</h3>
            <span className="text-sm font-medium text-brand-600">{totals.percentage}%</span>
          </div>
          <ProgressBar percentage={totals.percentage} />
          <p className="mt-4 text-sm text-brand-600">
            {formatCurrency(totals.totalRaisedCents / 100)} arrecadados de um objetivo total de{" "}
            {formatCurrency(totals.totalGoalCents / 100)}, distribuídos por {totals.soulsCount}{" "}
            almas.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl2 border border-brand-100 bg-white p-8 shadow-soft">
          <h3 className="mb-4 font-semibold text-brand-900">Arrecadado vs. meta por alma</h3>
          <TransparencyChart data={chartData} />
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          <h3 className="text-center font-semibold text-brand-900">Progresso por alma</h3>
          {souls.map((soul) => {
            const pct =
              soul.goal_cents > 0 ? Math.round((soul.raised_cents / soul.goal_cents) * 100) : 0;
            return (
              <div key={soul.id} className="rounded-xl border border-brand-100 bg-white p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-brand-800">Alma #{soul.code}</span>
                  <span className="text-brand-500">
                    {formatCurrency(soul.raised_cents / 100)} /{" "}
                    {formatCurrency(soul.goal_cents / 100)}
                  </span>
                </div>
                <ProgressBar percentage={pct} />
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-brand-900">Histórico de contribuições</h3>
            <a
              href="/api/transparencia/export"
              className="inline-flex items-center gap-2 rounded-full border border-brand-300 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
            >
              <Download className="h-4 w-4" aria-hidden />
              Exportar CSV
            </a>
          </div>
          {history.length === 0 ? (
            <p className="rounded-xl border border-brand-100 bg-white p-6 text-center text-sm text-brand-500">
              Ainda não há contribuições confirmadas.
            </p>
          ) : (
            <ul className="divide-y divide-brand-100 rounded-xl2 border border-brand-100 bg-white">
              {history.map((c, index) => (
                <li key={index} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-brand-800">
                    {c.donor_name}
                    {c.soul_code && (
                      <span className="text-brand-400"> · Alma #{c.soul_code}</span>
                    )}
                  </span>
                  <span className="text-right text-brand-600">
                    <span className="font-semibold text-brand-800">
                      {formatCurrency(c.amount_cents / 100)}
                    </span>
                    <span className="ml-3 text-xs text-brand-400">
                      {formatDateTime(c.created_at)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
    </>
  );
}
