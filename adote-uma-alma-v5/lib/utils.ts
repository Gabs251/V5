import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// Moedas: Euro (€) e Real Brasileiro (R$)
// Taxa FIXA do projeto: 110 € = 635 R$  (1 € = 5,7727 R$)
// Sem APIs externas — toda a conversão usa esta taxa fixa para
// manter barra de progresso, arrecadado e meta consistentes
// em Portugal e no Brasil.
// ============================================================

export type Currency = "eur" | "brl";

// 110 € correspondem a 635 R$
export const EUR_TO_BRL_RATE = 635 / 110; // 5.7727...

/** Converte um valor em Euros para Reais (mesma unidade, ex.: euros->reais). */
export function eurToBrl(eur: number): number {
  return eur * EUR_TO_BRL_RATE;
}

/** Converte um valor em Reais para Euros (mesma unidade). */
export function brlToEur(brl: number): number {
  return brl / EUR_TO_BRL_RATE;
}

/** Converte centavos de Real para centavos de Euro (inteiro). */
export function brlCentsToEurCents(brlCents: number): number {
  if (!brlCents || brlCents <= 0) return 0;
  return Math.round((brlCents * 110) / 635);
}

/** Converte centavos de Euro para centavos de Real (inteiro). */
export function eurCentsToBrlCents(eurCents: number): number {
  if (!eurCents || eurCents <= 0) return 0;
  return Math.round((eurCents * 635) / 110);
}

/** Formata um valor (na unidade da moeda) na moeda escolhida. */
export function formatMoney(value: number, currency: Currency = "eur"): string {
  if (currency === "brl") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formata um valor em Euros mostrando também o equivalente em Reais,
 * ex.: "110 € / R$ 635". Útil para metas das almas.
 */
export function formatDualCurrency(eurValue: number): string {
  const brlValue = eurToBrl(eurValue);
  return formatMoney(eurValue, "eur") + " / " + formatMoney(brlValue, "brl");
}

// Mantido para retrocompatibilidade (usa Euro).
export function formatCurrency(value: number): string {
  return formatMoney(value, "eur");
}

export function calcPercentage(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
