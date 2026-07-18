import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Obrigado",
  description: "A sua contribuição foi processada com sucesso.",
};

export default function ObrigadoPage() {
  return (
    <Section>
      <div className="mx-auto max-w-md rounded-xl2 border border-brand-100 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-7 w-7 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-semibold text-brand-900">Obrigado pela sua contribuição!</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-600">
          O seu pagamento foi processado com sucesso. A sua adoção será refletida no progresso
          da alma dentro de instantes.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Voltar ao início
        </Link>
      </div>
    </Section>
  );
}
