"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Não foi possível enviar a mensagem.");
      setSent(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Ocorreu um erro.");
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl2 border border-brand-100 bg-white p-10 text-center shadow-soft">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-brand-900">Mensagem enviada!</h3>
        <p className="mt-2 text-sm text-brand-600">Vamos responder assim que possível.</p>
        <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft"
    >
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} placeholder="O seu nome" />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} placeholder="o.seu@email.com" />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="message">Mensagem</Label>
        <Textarea id="message" rows={5} {...register("message")} placeholder="Escreva a sua mensagem..." />
        <FieldError message={errors.message?.message} />
      </div>
      <FieldError message={serverError ?? undefined} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> A enviar...
          </>
        ) : (
          "Enviar mensagem"
        )}
      </Button>
    </form>
  );
}
