import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/site/FaqAccordion";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Tire as suas dúvidas sobre o apadrinhamento, pagamentos MBWay e confirmação de contribuições.",
};

const faqs = [
  {
    question: "Como funciona o apadrinhamento de uma alma?",
    answer:
      "Escolhe uma alma disponível, contribui com o valor que desejar através de MBWay e envia o comprovativo. A nossa equipa confirma manualmente cada contribuição.",
  },
  {
    question: "Que métodos de pagamento estão disponíveis?",
    answer: "Neste momento aceitamos exclusivamente pagamentos através de MBWay.",
  },
  {
    question: "Porque é que o valor não atualiza logo após o pagamento?",
    answer:
      "Por segurança e transparência, cada contribuição só é somada ao total depois de ser validada manualmente pelo administrador, com base no comprovativo enviado.",
  },
  {
    question: "Posso apadrinhar mais do que uma alma?",
    answer: "Sim. Pode repetir o processo de adoção para quantas almas desejar apoiar.",
  },
  {
    question: "Como sei que a minha contribuição foi confirmada?",
    answer:
      "Assim que confirmada, o valor arrecadado, a percentagem e a barra de progresso da alma são atualizados automaticamente nas páginas públicas.",
  },
  {
    question: "O que é o Encontro com Deus Redenção?",
    answer:
      "É um retiro espiritual promovido pela Igreja Internacional Geração Profética, focado em restauração, cura e reencontro com a fé.",
  },
];

export default function FaqPage() {
  return (
    <Section>
      <SectionHeading eyebrow="Perguntas frequentes" title="Ainda tem dúvidas?" />
      <div className="mx-auto max-w-2xl">
        <FaqAccordion items={faqs} />
      </div>
    </Section>
  );
}
