"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Archive } from "lucide-react";
import { archiveSoul } from "@/app/admin/actions";
import { SoulForm } from "@/components/admin/SoulForm";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Soul } from "@/lib/types";

export function SoulRow({ soul }: { soul: Soul }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const statusVariant = soul.status === "adotada" ? "success" : soul.status === "arquivada" ? "danger" : "default";

  return (
    <div className="rounded-xl2 border border-brand-100 bg-white shadow-soft">
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-brand-900">Alma {soul.code}</span>
          <Badge variant={statusVariant}>{soul.status}</Badge>
          <span className="text-sm text-brand-500">
            {formatCurrency(soul.raised_cents / 100)} / {formatCurrency(soul.goal_cents / 100)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {soul.status !== "arquivada" && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                startTransition(() => archiveSoul(soul.id));
              }}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              <Archive className="h-3.5 w-3.5" aria-hidden />
              {isPending ? "..." : "Arquivar"}
            </span>
          )}
          <ChevronDown className={`h-5 w-5 text-brand-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-brand-100 px-6 py-5">
          <SoulForm mode="edit" soul={soul} />
        </div>
      )}
    </div>
  );
}
