// Multimoeda com taxa fixa do projeto: 110 € = 635 R$.
// Sem APIs nem taxas de câmbio em tempo real — todas as conversões usam esta taxa
// para manter a barra de progresso, os valores arrecadados e a meta consistentes.

import type { Currency } from "@/lib/types";

export const GOAL_EUR_CENTS = 11000; // 110 €
export const GOAL_BRL_CENTS = 63500; // 635 R$

// 1 € ≈ 5,7727 R$
export const BRL_PER_EUR = GOAL_BRL_CENTS / GOAL_EUR_CENTS;

export const PIX_KEY = "119.749.257-73";
export const CONTACT_PHONE = "+351 922 262 241";

export function toEurCents(amountCents: number, currency: Currency): number {
  if (currency === "EUR") return amountCents;
  return Math.round((amountCents * GOAL_EUR_CENTS) / GOAL_BRL_CENTS);
}

export function fromEurCents(eurCents: number, currency: Currency): number {
  if (currency === "EUR") return eurCents;
  return Math.round((eurCents * GOAL_BRL_CENTS) / GOAL_EUR_CENTS);
}

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "EUR" ? "pt-PT" : "pt-BR", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatCents(cents: number, currency: Currency): string {
  return formatMoney(cents / 100, currency);
}
