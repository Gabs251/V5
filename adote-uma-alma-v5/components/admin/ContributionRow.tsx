"use client";

import { useState, useTransition } from "react";
import { Check, X, FileText } from "lucide-react";
import { confirmContribution, rejectContribution } from "@/app/admin/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface ContributionWithSoul {
  id: string;
  donor_name: string;
  amount_cents: number;
  proof_url: string | null;
  status: "pendente" | "confirmada" | "rejeitada";
  created_at: string;
  souls?: { code: string } | null;
}

export function ContributionRow({
  contribution,
  readOnly = false,
}: {
  contribution: ContributionWithSoul;
  readOnly?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");

  const statusVariant =
    contribution.status === "confirmada"
      ? "success"
      : contribution.status === "rejeitada"
        ? "danger"
        : "pending";

  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-brand-100 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-brand-900">{contribution.donor_name}</span>
          <Badge variant={statusVariant}>{contribution.status}</Badge>
          {contribution.souls?.code && (
            <span className="text-xs text-brand-500">Alma {contribution.souls.code}</span>
          )}
        </div>
        <p className="mt-1 text-sm text-brand-600">
          {formatCurrency(contribution.amount_cents / 100)} · {formatDateTime(contribution.created_at)}
        </p>
        {contribution.proof_url && (
          <a
            href={contribution.proof_url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-800"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden /> Ver comprovativo
          </a>
        )}
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nota (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-32 rounded-lg border border-brand-200 px-2 py-1.5 text-sm focus-ring sm:w-40"
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={isPending}
            onClick={() => startTransition(() => confirmContribution(contribution.id))}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => startTransition(() => rejectContribution(contribution.id, note))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
