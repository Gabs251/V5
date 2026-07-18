import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { HandHeart, Globe2, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a Igreja Internacional Geração Profética e a missão por trás do projeto Adote uma Alma.",
};

const pillars = [
  {
    icon: HandHeart,
    title: "Paternidade espiritual",
    description:
      "Cremos que cada pessoa merece ser acompanhada, cuidada e guiada — como um pai cuida dos seus filhos.",
  },
  {
    icon: Globe2,
    title: "Alcance às nações",
    description:
      "Trabalhamos para levar esperança a diferentes países, culturas e gerações, sem fronteiras.",
  },
  {
    icon: Users,
    title: "Comunidade que sustenta",
    description:
      "Cada contribuição une uma comunidade de padrinhos e madrinhas espirituais em torno de uma só missão.",
  },
];

export default function QuemSomosPage() {
  return (
    <>
      <Section className="pb-0">
        <SectionHeading
          eyebrow="A nossa missão"
          title="Levamos paternidade às nações, uma alma de cada vez."
          description="Somos a Igreja Internacional Geração Profética. O projeto Adote uma Alma nasce do desejo profundo de que nenhuma pessoa seja esquecida — através da oração intercessora, do cuidado material e do acompanhamento espiritual."
        />
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft">
              <pillar.icon className="mb-4 h-8 w-8 text-brand-500" aria-hidden />
              <h3 className="mb-2 font-semibold text-brand-900">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-brand-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-3xl space-y-4 text-brand-700">
          <h2 className="text-2xl font-semibold text-brand-900">O Encontro com Deus Redenção</h2>
          <p className="leading-relaxed">
            O Encontro com Deus Redenção é um retiro espiritual intensivo, pensado para quem
            atravessa momentos de quebra, procura restauração ou deseja reencontrar a sua fé.
            Muitas pessoas não têm condições financeiras para participar — é aqui que entra o
            projeto Adote uma Alma: através do apadrinhamento, tornamos possível que ninguém
            fique de fora por falta de recursos.
          </p>
          <p className="leading-relaxed">
            Cada contribuição recebida é acompanhada de perto, com total transparência sobre o
            destino dos valores arrecadados, disponível na página de{" "}
            <a href="/transparencia" className="font-medium text-brand-800 underline">
              Transparência
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
