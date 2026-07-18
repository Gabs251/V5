"use client";

import { useTransition } from "react";
import { createSoul, updateSoul } from "@/app/admin/actions";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Soul } from "@/lib/types";

export function SoulForm({ mode, soul }: { mode: "create" | "edit"; soul?: Soul }) {
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    startTransition(async () => {
      if (mode === "create") {
        await createSoul(formData);
      } else if (soul) {
        await updateSoul(soul.id, formData);
      }
    });
  }

  return (
    <form action={handleAction} className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="code">Código / identificador</Label>
        <Input id="code" name="code" defaultValue={soul?.code} required />
      </div>
      <div>
        <Label htmlFor="age">Idade (opcional)</Label>
        <Input id="age" name="age" type="number" min={1} max={120} defaultValue={soul?.age ?? ""} />
      </div>
      <div>
        <Label htmlFor="country">País</Label>
        <Input id="country" name="country" defaultValue={soul?.country} required />
      </div>
      <div>
        <Label htmlFor="extra_info">Informação adicional (opcional)</Label>
        <Input id="extra_info" name="extra_info" defaultValue={soul?.extra_info ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={soul?.description} required />
      </div>
      <div>
        <Label htmlFor="goal">Meta (€)</Label>
        <Input
          id="goal"
          name="goal"
          type="number"
          min={1}
          step="0.01"
          defaultValue={soul ? soul.goal_cents / 100 : 110}
          required
        />
      </div>
      <div>
        <Label htmlFor="raised">Valor arrecadado (€)</Label>
        <Input
          id="raised"
          name="raised"
          type="number"
          min={0}
          step="0.01"
          defaultValue={soul ? soul.raised_cents / 100 : 0}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          name="status"
          defaultValue={soul?.status ?? "disponivel"}
          className="w-full rounded-lg border border-brand-200 bg-white px-4 py-3 text-brand-900 focus-ring"
        >
          <option value="disponivel">Disponível</option>
          <option value="adotada">Adotada</option>
          <option value="arquivada">Arquivada</option>
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "A guardar..." : mode === "create" ? "Criar alma" : "Guardar alterações"}
        </Button>
      </div>
    </form>
  );
}
