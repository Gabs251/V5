import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Countdown } from "@/components/site/Countdown";
import { StatsGrid, buildHomeStats } from "@/components/site/StatsGrid";
import { HowItWorks } from "@/components/site/HowItWorks";
import { SoulCard } from "@/components/site/SoulCard";
import { Logo } from "@/components/site/Logo";
import { getSouls, getTransparencyTotals, getSiteSetting } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [souls, totals, eventDateSetting, nationsSetting] = await Promise.all([
    getSouls(),
    getTransparencyTotals(),
    getSiteSetting("event_date"),
    getSiteSetting("nations_reached"),
  ]);

  const eventDate =
    eventDateSetting ?? process.env.NEXT_PUBLIC_EVENTO_DATA ?? "2026-07-24T21:30:00+01:00";
  const adoptedCount = souls.filter((s) => s.status === "adotada").length;
  const computedCountries = new Set(souls.map((s) => s.country)).size;
  const countriesReached =
    nationsSetting && Number(nationsSetting) > 0 ? Number(nationsSetting) : computedCountries;

  const stats = buildHomeStats({
    soulsCount: souls.length,
    adoptedCount,
    raisedCents: totals.totalRaisedCents,
    countriesReached,
  });

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-100 via-brand-50 to-brand-50 py-16 sm:py-24">
        <div className="container-page relative flex flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-600 shadow-soft">
            <Logo withText={false} size={20} />
            Paternidade às nações
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-brand-900 sm:text-6xl">
            Adote uma Alma
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-700">
            Ajude alguém a participar do Encontro com Deus Redenção.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="#almas"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-lg font-medium text-white shadow-soft transition-all duration-200 hover:bg-brand-700"
            >
              Investir Agora <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/quem-somos"
              className="inline-flex items-center gap-2 rounded-full border border-brand-300 px-8 py-4 text-lg font-medium text-brand-700 transition-all duration-200 hover:bg-brand-100"
            >
              Como funciona
            </Link>
          </div>

          <div className="mt-14 w-full">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              Contagem regressiva até ao encontro
            </p>
            <Countdown targetDate={eventDate} />
          </div>
        </div>
      </section>

      <Section id="almas" className="scroll-mt-24">
        <SectionHeading
          eyebrow="A nossa missão em nomes"
          title="Cada alma tem um nome, um rosto, uma esperança."
          description="Escolha uma alma para apadrinhar. Acompanhe o progresso e receba testemunhos ao longo da jornada."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {souls.map((soul) => (
            <SoulCard key={soul.id} soul={soul} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/adote-uma-alma"
            className="inline-flex items-center gap-2 rounded-full border border-brand-300 px-6 py-3 text-base font-medium text-brand-700 transition-all duration-200 hover:bg-brand-100"
          >
            Ver todas as almas →
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <StatsGrid stats={stats} />
      </Section>

      <HowItWorks />

      <Section className="bg-brand-900 text-brand-50">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-medium italic leading-relaxed sm:text-3xl">
            &ldquo;Aquele que salva uma alma, salva um mundo inteiro.&rdquo;
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
            A força de um só coração muda gerações
          </p>
        </div>
      </Section>
    </>
  );
}
