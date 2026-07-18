"use client";

import { useTransition } from "react";
import { updateProjectSettings } from "@/app/admin/actions";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SettingsForm({
  initialMbway,
  initialEventDate,
  initialNations,
}: {
  initialMbway: string;
  initialEventDate: string;
  initialNations: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => updateProjectSettings(formData))}
      className="grid gap-4 sm:grid-cols-3"
    >
      <div>
        <Label htmlFor="mbway_number">Número MB WAY</Label>
        <Input id="mbway_number" name="mbway_number" defaultValue={initialMbway} />
      </div>
      <div>
        <Label htmlFor="event_date">Data do encontro (ISO)</Label>
        <Input
          id="event_date"
          name="event_date"
          placeholder="2026-07-24T21:30:00+01:00"
          defaultValue={initialEventDate}
        />
      </div>
      <div>
        <Label htmlFor="nations_reached">Nações alcançadas (vazio = automático)</Label>
        <Input
          id="nations_reached"
          name="nations_reached"
          type="number"
          min={0}
          defaultValue={initialNations}
        />
      </div>
      <Button type="submit" disabled={isPending} className="sm:col-span-3">
        {isPending ? "A guardar..." : "Guardar configurações"}
      </Button>
    </form>
  );
}
