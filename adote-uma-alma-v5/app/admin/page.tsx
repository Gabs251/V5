import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: souls }, { data: contributions }, { data: settings }] = await Promise.all([
    supabase.from("souls").select("*"),
    supabase.from("contributions").select("*").order("created_at", { ascending: true }),
    supabase.from("site_settings").select("*"),
  ]);

  const confirmed = (contributions ?? []).filter((c) => c.status === "confirmada");
  const pending = (contributions ?? []).filter((c) => c.status === "pendente");
  const totalRaised = confirmed.reduce((sum, c) => sum + c.amount_cents, 0);

  const chartData = confirmed.reduce<Record<string, number>>((acc, c) => {
    const day = new Date(c.created_at).toLocaleDateString("pt-PT");
    acc[day] = (acc[day] ?? 0) + c.amount_cents / 100;
    return acc;
  }, {});
  const series = Object.entries(chartData).map(([date, total]) => ({ date, total }));

  const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand-900">Dashboard</h1>
        <p className="text-sm text-brand-500">Visão geral do projeto Adote uma Alma.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Almas" value={String(souls?.length ?? 0)} />
        <StatCard label="Contribuições pendentes" value={String(pending.length)} />
        <StatCard label="Contribuições confirmadas" value={String(confirmed.length)} />
        <StatCard label="Total arrecadado" value={formatCurrency(totalRaised / 100)} />
      </div>

      <div className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-semibold text-brand-900">Arrecadação ao longo do tempo</h2>
        <AdminCharts data={series} />
      </div>

      <div className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-semibold text-brand-900">Configurações do projeto</h2>
        <SettingsForm
          initialMbway={settingsMap.mbway_number ?? ""}
          initialEventDate={settingsMap.event_date ?? ""}
          initialNations={settingsMap.nations_reached ?? ""}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl2 border border-brand-100 bg-white p-5 shadow-soft">
      <p className="text-2xl font-bold text-brand-800">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-brand-500">{label}</p>
    </div>
  );
}
