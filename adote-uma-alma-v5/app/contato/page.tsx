import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/site/ContactForm";
import { Mail, Instagram, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipa do projeto Adote uma Alma.",
};

const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "gp.portugal";

export default function ContatoPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Contato"
        title="Fale connosco"
        description="Tem dúvidas sobre o apadrinhamento ou quer saber mais sobre o Encontro com Deus Redenção? Estamos aqui."
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <ContactForm />
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl2 border border-brand-100 bg-white p-5 shadow-soft">
            <Phone className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
            <div>
              <a href="tel:+351965012201" className="font-medium text-brand-700 hover:text-brand-900">
                +351 965 012 201
              </a>
              <p className="text-xs text-brand-400">Telefone / MBWay</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl2 border border-brand-100 bg-white p-5 shadow-soft">
            <Mail className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
            <a href="mailto:geral@adoteumaalma.pt" className="text-brand-700 hover:text-brand-900">
              geral@adoteumaalma.pt
            </a>
          </div>
          <div className="flex items-center gap-3 rounded-xl2 border border-brand-100 bg-white p-5 shadow-soft">
            <Instagram className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
            <a
              href={"https://instagram.com/" + instagramHandle}
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-700 hover:text-brand-900"
            >
              @{instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
