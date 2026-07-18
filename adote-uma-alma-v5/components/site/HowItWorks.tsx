import { Fingerprint, HandCoins, FileCheck2, Hourglass, LineChart } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";

const steps = [
  {
    icon: Fingerprint,
    title: "Escolha uma alma",
    description: "Explore os cartões e leia a história de cada alma. Escolha aquela cuja jornada toca o seu coração.",
  },
  {
    icon: HandCoins,
    title: "Faça a sua contribuição",
    description: "Contribua através de MBWay — de forma simples, segura e direta.",
  },
  {
    icon: FileCheck2,
    title: "Envie o comprovativo",
    description: "Indique o seu nome, o valor contribuído e anexe o comprovativo do pagamento.",
  },
  {
    icon: Hourglass,
    title: "Aguarde confirmação",
    description: "A nossa equipa confirma manualmente cada contribuição antes de a somar ao total.",
  },
  {
    icon: LineChart,
    title: "Acompanhe o progresso",
    description: "Veja a barra de progresso da alma atualizar-se e receba notícias da transformação.",
  },
];

export function HowItWorks() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Simples & transparente"
        title="Cinco passos para semear amor."
        description="Um processo claro, seguro e cheio de sentido — desde a escolha até ao testemunho final."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.title} className="relative rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft">
            <span className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {index + 1}
            </span>
            <step.icon className="mb-4 mt-2 h-8 w-8 text-brand-500" aria-hidden />
            <h3 className="mb-2 font-semibold text-brand-900">{step.title}</h3>
            <p className="text-sm leading-relaxed text-brand-600">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
