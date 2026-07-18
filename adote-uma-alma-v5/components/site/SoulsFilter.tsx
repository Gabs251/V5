"use client";

import { useMemo, useState } from "react";
import { SoulCard } from "@/components/site/SoulCard";
import { cn } from "@/lib/utils";
import type { Soul } from "@/lib/types";

type Filter = "todas" | "disponiveis" | "adotadas";

export function SoulsFilter({ souls }: { souls: Soul[] }) {
  const [filter, setFilter] = useState<Filter>("todas");

  const available = souls.filter((s) => s.status === "disponivel").length;
  const adopted = souls.filter((s) => s.status === "adotada").length;

  const filtered = useMemo(() => {
    if (filter === "disponiveis") return souls.filter((s) => s.status === "disponivel");
    if (filter === "adotadas") return souls.filter((s) => s.status === "adotada");
    return souls;
  }, [souls, filter]);

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "todas", label: "Todas", count: souls.length },
    { key: "disponiveis", label: "Disponíveis", count: available },
    { key: "adotadas", label: "Adotadas", count: adopted },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filtrar almas">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={filter === tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors focus-ring",
              filter === tab.key
                ? "bg-brand-600 text-white"
                : "bg-white text-brand-700 hover:bg-brand-100"
            )}
          >
            {tab.label} {tab.count}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-brand-500">Nenhuma alma encontrada nesta categoria.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((soul) => (
            <SoulCard key={soul.id} soul={soul} />
          ))}
        </div>
      )}
    </div>
  );
}
