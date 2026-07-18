import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { HeartHandshake, Home as HomeIcon, BookOpen, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Investimentos",
  description: "Saiba como cada contribuição é aplicada para levar as almas ao Encontro com Deus Redenção.",
};

const categories = [
  {
    icon: HeartHandshake,
    title: "Inscrição no Encontro",
    description: "Cobre o valor de participação de cada alma no Encontro com Deus Redenção.",
  },
  {
    icon: HomeIcon,
    title: "Alojamento e deslocação",
    description: "Apoio logístico para quem precisa de viajar até ao local do encontro.",
  },
  {
    icon: Utensils,
    title: "Alimentação",
    description: "Refeições durante os dias de retiro espiritual.",
  },
  {
    icon: BookOpen,
    title: "Material de acompanhamento",
    description: "Materiais de estudo e apoio para a jornada espiritual após o encontro.",
  },
];

export default function InvestimentosPage() {
  return (
    <>
      <Section className="pb-0">
        <SectionHeading
          eyebrow="Investimentos"
          title="Para onde vai cada contribuição."
          description="Cada valor confirmado é aplicado diretamente na jornada da alma apadrinhada — do custo do encontro ao acompanhamento posterior."
        />
      </Section>
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.title} className="flex gap-4 rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft">
              <cat.icon className="h-8 w-8 shrink-0 text-brand-500" aria-hidden />
              <div>
                <h3 className="mb-1 font-semibold text-brand-900">{cat.title}</h3>
                <p className="text-sm leading-relaxed text-brand-600">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
