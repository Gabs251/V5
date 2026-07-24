import { createClient } from "@/lib/supabase/server";
import { toEurCents } from "@/lib/currency";
import type { Currency, Soul, TransparencyTotals } from "@/lib/types";

// Almas apresentadas enquanto a base de dados não devolve registos.
export const FALLBACK_SOULS: Soul[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    code: "01",
    age: 21,
    country: "Angola",
    extra_info: "Feminino · Estudante do Curso Profissional de Tecnologia · Primeira vez",
    description:
      "Tenho 21 anos, sou angolana e atualmente estudo num Curso Profissional de Tecnologia. Desde que cheguei a Portugal tenho procurado crescer espiritualmente e fortalecer a minha caminhada com Deus. Esta será a minha primeira oportunidade de participar no Encontro com Deus Redenção, um momento que acredito que poderá transformar profundamente a minha vida. O meu desejo é conhecer mais de Deus, fortalecer a minha fé e regressar preparada para viver os propósitos que Ele tem para mim. A sua contribuição permitirá que esta experiência se torne uma realidade.",
    image_url: null,
    goal_cents: 11000,
    raised_cents: 0,
    status: "disponivel",
    created_at: "2026-07-01T00:00:00.000Z",
    updated_at: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    code: "02",
    age: 32,
    country: "Brasil",
    extra_info: "Divorciada · Mãe de 3 filhos",
    description:
      "Deseja participar pela primeira vez no Encontro com Deus Redenção para entregar completamente a sua vida a Jesus.",
    image_url: null,
    goal_cents: 11000,
    raised_cents: 0,
    status: "disponivel",
    created_at: "2026-07-01T00:00:01.000Z",
    updated_at: "2026-07-01T00:00:01.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    code: "03",
    age: 20,
    country: "Brasil",
    extra_info: "Mãe de uma criança",
    description:
      "Tenho 20 anos, sou mãe de uma criança e desejo participar novamente no Encontro com Deus Redenção. Na minha primeira experiência fui profundamente impactada pelo amor de Deus e saí fortalecida espiritualmente. Quero viver mais uma vez este tempo de renovação, crescimento e comunhão com os irmãos, para continuar firme nos propósitos que Deus tem para a minha vida e para a minha família.",
    image_url: null,
    goal_cents: 11000,
    raised_cents: 0,
    status: "disponivel",
    created_at: "2026-07-01T00:00:02.000Z",
    updated_at: "2026-07-01T00:00:02.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    code: "04",
    age: 20,
    country: "Brasil",
    extra_info: "Mãe de uma criança",
    description:
      "Sou mãe de uma criança e desejo participar pela primeira vez no Encontro com Deus Redenção. Tenho buscado me aproximar mais de Deus e acredito que este encontro será uma oportunidade para transformar a minha vida, fortalecer a minha fé e construir um futuro melhor para mim e para o meu filho. O meu desejo é conhecer mais profundamente o amor e os planos de Deus para a nossa família.",
    image_url: null,
    goal_cents: 11000,
    raised_cents: 0,
    status: "disponivel",
    created_at: "2026-07-01T00:00:03.000Z",
    updated_at: "2026-07-01T00:00:03.000Z",
  },
];

export async function getSouls(): Promise<Soul[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("souls")
      .select("*")
      .neq("status", "arquivada")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK_SOULS;
    return data as Soul[];
  } catch {
    return FALLBACK_SOULS;
  }
}

export async function getSoulById(id: string): Promise<Soul | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("souls").select("*").eq("id", id).single();
    if (error || !data) return FALLBACK_SOULS.find((s) => s.id === id) ?? null;
    return data as Soul;
  } catch {
    return FALLBACK_SOULS.find((s) => s.id === id) ?? null;
  }
}

export async function getTransparencyTotals(): Promise<TransparencyTotals> {
  const souls = await getSouls();

  let contributionsCount = 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("contributions")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmada");
    contributionsCount = count ?? 0;
  } catch {
    contributionsCount = 0;
  }

  const totalRaisedCents = souls.reduce((sum, s) => sum + s.raised_cents, 0);
  const totalGoalCents = souls.reduce((sum, s) => sum + s.goal_cents, 0);
  const percentage =
    totalGoalCents > 0 ? Math.min(100, Math.round((totalRaisedCents / totalGoalCents) * 100)) : 0;

  return {
    totalRaisedCents,
    totalGoalCents,
    soulsCount: souls.length,
    contributionsCount,
    percentage,
  };
}

export interface ConfirmedContribution {
  donor_name: string;
  amount_cents: number;
  created_at: string;
  soul_code: string | null;
}

export async function getConfirmedContributions(limit = 50): Promise<ConfirmedContribution[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contributions")
      .select("donor_name, amount_cents, currency, created_at, souls(code)")
      .eq("status", "confirmada")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return (data as unknown as Array<{ donor_name: string; amount_cents: number; currency: Currency | null; created_at: string; souls: { code: string } | null }>).map(
      (row) => ({
        donor_name: row.donor_name,
        // Contribuições em BRL são apresentadas em euros à taxa fixa do projeto
        // (110 € = 635 R$), para manter a transparência numa única moeda base.
        amount_cents: toEurCents(row.amount_cents, row.currency ?? "EUR"),
        created_at: row.created_at,
        soul_code: row.souls?.code ?? null,
      })
    );
  } catch {
    return [];
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", key).single();
    return data?.value ?? null;
  } catch {
    return null;
  }
}
