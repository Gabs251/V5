import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SoulsFilter } from "@/components/site/SoulsFilter";
import { getSouls } from "@/lib/data";

export const metadata: Metadata = {
  title: "Adote uma Alma",
  description: "Escolha uma alma e apadrinhe a sua jornada até ao Encontro com Deus Redenção.",
};

export const revalidate = 0;

export default async function AdoteUmaAlmaPage() {
  const souls = await getSouls();

  return (
    <Section>
      <SectionHeading
        eyebrow="Adote uma alma"
        title="Cada nome é uma história. Cada história é uma jornada."
        description="Ao apadrinhar uma alma, contribui em oração, recursos e amor para que ninguém percorra este caminho sozinho."
      />
      <SoulsFilter souls={souls} />
    </Section>
  );
}
