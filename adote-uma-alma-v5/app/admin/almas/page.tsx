import { createClient } from "@/lib/supabase/server";
import { SoulForm } from "@/components/admin/SoulForm";
import { SoulRow } from "@/components/admin/SoulRow";
import type { Soul } from "@/lib/types";

export const revalidate = 0;

export default async function AdminAlmasPage() {
  const supabase = await createClient();
  const { data: souls } = await supabase
    .from("souls")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand-900">Almas</h1>
        <p className="text-sm text-brand-500">Crie e edite as almas disponíveis para apadrinhamento.</p>
      </div>

      <div className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-semibold text-brand-900">Nova alma</h2>
        <SoulForm mode="create" />
      </div>

      <div className="space-y-4">
        {((souls ?? []) as Soul[]).map((soul) => (
          <SoulRow key={soul.id} soul={soul} />
        ))}
      </div>
    </div>
  );
}
