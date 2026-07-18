import { formatCurrency } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl2 border border-brand-100 bg-white p-6 text-center shadow-soft">
          <dd className="text-3xl font-bold text-brand-700 sm:text-4xl">{stat.value}</dd>
          <dt className="mt-2 text-xs font-medium uppercase tracking-wide text-brand-500 sm:text-sm">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

export function buildHomeStats({
  soulsCount,
  adoptedCount,
  raisedCents,
  countriesReached,
}: {
  soulsCount: number;
  adoptedCount: number;
  raisedCents: number;
  countriesReached: number;
}): Stat[] {
  return [
    { label: "Almas no projeto", value: String(soulsCount) },
    { label: "Já adotadas", value: String(adoptedCount) },
    { label: "Arrecadado", value: formatCurrency(raisedCents / 100) },
    { label: "Nações alcançadas", value: String(countriesReached) },
  ];
}
