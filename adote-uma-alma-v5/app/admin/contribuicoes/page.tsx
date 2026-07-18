import { createClient } from "@/lib/supabase/server";
import { ContributionRow } from "@/components/admin/ContributionRow";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

export const revalidate = 0;

export default async function AdminContribuicoesPage() {
  const supabase = await createClient();
  const { data: contributions } = await supabase
    .from("contributions")
    .select("*, souls(code)")
    .order("created_at", { ascending: false });

  const pending = (contributions ?? []).filter((c) => c.status === "pendente");
  const reviewed = (contributions ?? []).filter((c) => c.status !== "pendente");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-900">Contribuições</h1>
          <p className="text-sm text-brand-500">Confirme ou rejeite as contribuições recebidas.</p>
        </div>
        <a href="/api/admin/export">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </a>
      </div>

      <section>
        <h2 className="mb-3 font-semibold text-brand-900">
          Pendentes <span className="text-brand-400">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-brand-500">Nenhuma contribuição pendente.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((c) => (
              <ContributionRow key={c.id} contribution={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-brand-900">Histórico</h2>
        {reviewed.length === 0 ? (
          <p className="text-sm text-brand-500">Ainda sem histórico.</p>
        ) : (
          <div className="space-y-3">
            {reviewed.map((c) => (
              <ContributionRow key={c.id} contribution={c} readOnly />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
