"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Copy, CreditCard, Smartphone, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { formatCurrency, cn } from "@/lib/utils";
import type { Soul } from "@/lib/types";

const presetAmounts = [5, 10, 20, 30, 50, 100];
const MBWAY_NUMBER = process.env.NEXT_PUBLIC_MBWAY_NUMBER ?? "+351 932 849 338";

const countries = [
  "Portugal",
  "Brasil",
  "Angola",
  "Moçambique",
  "Cabo Verde",
  "Guiné-Bissau",
  "São Tomé e Príncipe",
  "Espanha",
  "França",
  "Reino Unido",
  "Alemanha",
  "Suíça",
  "Luxemburgo",
  "Estados Unidos",
  "Outro",
];

type Step = "valor" | "metodo" | "mbway" | "comprovativo" | "cartao" | "sucesso";

interface CardForm {
  name: string;
  email: string;
  phone: string;
  number: string;
  expiry: string;
  cvc: string;
  country: string;
  postal: string;
  terms: boolean;
}

function digitsOnly(value: string): string {
  return value
    .split("")
    .filter((c) => c >= "0" && c <= "9")
    .join("");
}

function formatCardNumber(value: string): string {
  const digits = digitsOnly(value).slice(0, 19);
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(" ");
}

function luhnValid(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

function expiryValid(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length !== 4) return false;
  const month = Number(digits.slice(0, 2));
  const year = 2000 + Number(digits.slice(2, 4));
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= new Date();
}

function emailValid(value: string): boolean {
  const at = value.indexOf("@");
  if (at < 1) return false;
  const domain = value.slice(at + 1);
  return domain.includes(".") && domain.length >= 3 && !value.includes(" ");
}

export function AdoptModal({ soul, onClose }: { soul: Soul; onClose: () => void }) {
  const [step, setStep] = useState<Step>("valor");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [card, setCard] = useState<CardForm>({
    name: "",
    email: "",
    phone: "",
    number: "",
    expiry: "",
    cvc: "",
    country: "Portugal",
    postal: "",
    terms: false,
  });
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardForm, string>>>({});

  const finalAmount = amount ?? Number(customAmount) ?? 0;

  function selectAmount(value: number) {
    setAmount(value);
    setCustomAmount("");
  }

  function setCardField<K extends keyof CardForm>(field: K, value: CardForm[K]) {
    setCard((prev) => ({ ...prev, [field]: value }));
    setCardErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(MBWAY_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — o número continua visível para cópia manual
    }
  }

  function validateCardForm(): boolean {
    const errors: Partial<Record<keyof CardForm, string>> = {};
    if (card.name.trim().length < 3) errors.name = "Indique o nome completo.";
    if (!emailValid(card.email)) errors.email = "Indique um email válido.";
    if (!luhnValid(card.number)) errors.number = "Número de cartão inválido.";
    if (!expiryValid(card.expiry)) errors.expiry = "Data de validade inválida.";
    const cvcDigits = digitsOnly(card.cvc);
    if (cvcDigits.length < 3 || cvcDigits.length > 4) errors.cvc = "CVC inválido.";
    if (!card.country) errors.country = "Selecione o país.";
    if (card.postal.trim().length < 3) errors.postal = "Indique o código postal.";
    if (!card.terms) errors.terms = "É necessário aceitar os termos.";
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function startCardCheckout() {
    setError(null);
    if (!validateCardForm()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soul_id: soul.id,
          donor_name: card.name,
          email: card.email,
          phone: card.phone || null,
          amount_cents: Math.round(finalAmount * 100),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.url) {
        throw new Error(body.error ?? "Não foi possível iniciar o pagamento.");
      }
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!donorName.trim()) {
      setError("Indique o seu nome.");
      return;
    }
    if (!file) {
      setError("Anexe o comprovativo do pagamento.");
      return;
    }
    if (!finalAmount || finalAmount < 1) {
      setError("Indique um valor válido.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const filePath = soul.id + "/" + Date.now() + "." + fileExt;

      const { error: uploadError } = await supabase.storage
        .from("comprovativos")
        .upload(filePath, file);

      if (uploadError) throw new Error("Não foi possível enviar o comprovativo.");

      const { data: publicUrlData } = supabase.storage
        .from("comprovativos")
        .getPublicUrl(filePath);

      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soul_id: soul.id,
          donor_name: donorName,
          amount_cents: Math.round(finalAmount * 100),
          proof_url: publicUrlData.publicUrl,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Não foi possível registar a contribuição.");
      }

      setStep("sucesso");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={"Investir na Alma #" + soul.code}
      >
        <motion.div
          className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl2 bg-white p-6 shadow-card sm:p-8"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full p-1 text-brand-400 hover:bg-brand-100 hover:text-brand-700 focus-ring"
          >
            <X className="h-5 w-5" />
          </button>

          {step === "valor" && (
            <div>
              <h2 className="text-xl font-semibold text-brand-900">Investir na Alma #{soul.code}</h2>
              <p className="mt-1 text-sm text-brand-600">Escolha o valor da sua contribuição.</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {presetAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => selectAmount(value)}
                    className={cn(
                      "rounded-lg border py-3 text-sm font-semibold transition-colors focus-ring",
                      amount === value
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-brand-200 text-brand-700 hover:bg-brand-100"
                    )}
                  >
                    {value}€
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Label htmlFor="custom-amount">Outro valor (€)</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min={1}
                  step="0.01"
                  placeholder="Ex: 25"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(null);
                  }}
                />
              </div>
              <Button
                className="mt-6 w-full"
                disabled={!finalAmount || finalAmount < 1}
                onClick={() => setStep("metodo")}
              >
                Continuar
              </Button>
            </div>
          )}

          {step === "metodo" && (
            <div>
              <h2 className="text-xl font-semibold text-brand-900">Método de pagamento</h2>
              <p className="mt-1 text-sm text-brand-600">
                Valor: <strong>{formatCurrency(finalAmount)}</strong> — escolha como quer contribuir.
              </p>
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setStep("mbway")}
                  className="flex w-full items-center gap-3 rounded-xl2 border border-brand-200 p-4 text-left transition-colors hover:border-brand-400 hover:bg-brand-50 focus-ring"
                >
                  <Smartphone className="h-6 w-6 shrink-0 text-brand-500" aria-hidden />
                  <span>
                    <span className="block font-semibold text-brand-900">MB WAY</span>
                    <span className="block text-sm text-brand-600">
                      Transferência direta com comprovativo
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep("cartao")}
                  className="flex w-full items-center gap-3 rounded-xl2 border border-brand-200 p-4 text-left transition-colors hover:border-brand-400 hover:bg-brand-50 focus-ring"
                >
                  <CreditCard className="h-6 w-6 shrink-0 text-brand-500" aria-hidden />
                  <span>
                    <span className="block font-semibold text-brand-900">Cartão de Crédito</span>
                    <span className="block text-sm text-brand-600">Pagamento seguro via Stripe</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === "mbway" && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-brand-900">Pagamento via MB WAY</h2>
              <p className="mt-1 text-sm text-brand-600">
                Valor a contribuir: <strong>{formatCurrency(finalAmount)}</strong>
              </p>
              <p className="mt-6 text-sm text-brand-600">Envie o valor para o número MB WAY:</p>
              <div className="mx-auto mt-3 flex max-w-xs items-center justify-center gap-2 rounded-xl2 border border-brand-200 bg-brand-50 px-4 py-4">
                <span className="text-lg font-bold tracking-wide text-brand-800">{MBWAY_NUMBER}</span>
                <button
                  type="button"
                  onClick={copyNumber}
                  aria-label="Copiar número MB WAY"
                  className="rounded-full p-2 text-brand-500 transition-colors hover:bg-brand-100 hover:text-brand-800 focus-ring"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              {copied && <p className="mt-2 text-xs font-medium text-emerald-600">Número copiado!</p>}
              <Button className="mt-6 w-full" onClick={() => setStep("comprovativo")}>
                Já paguei, enviar comprovativo
              </Button>
            </div>
          )}

          {step === "cartao" && (
            <div>
              <h2 className="text-xl font-semibold text-brand-900">Pagamento com cartão</h2>
              <p className="mt-1 text-sm text-brand-600">
                Valor: <strong>{formatCurrency(finalAmount)}</strong>
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="cc-name">Nome completo</Label>
                  <Input
                    id="cc-name"
                    value={card.name}
                    onChange={(e) => setCardField("name", e.target.value)}
                    placeholder="Como aparece no cartão"
                    autoComplete="cc-name"
                  />
                  <FieldError message={cardErrors.name} />
                </div>

                <div>
                  <Label htmlFor="cc-email">Email</Label>
                  <Input
                    id="cc-email"
                    type="email"
                    value={card.email}
                    onChange={(e) => setCardField("email", e.target.value)}
                    placeholder="o.seu@email.com"
                    autoComplete="email"
                  />
                  <FieldError message={cardErrors.email} />
                </div>

                <div>
                  <Label htmlFor="cc-phone">Telefone (opcional)</Label>
                  <Input
                    id="cc-phone"
                    type="tel"
                    value={card.phone}
                    onChange={(e) => setCardField("phone", e.target.value)}
                    placeholder="+351 900 000 000"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <Label htmlFor="cc-number">Número do cartão</Label>
                  <Input
                    id="cc-number"
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) => setCardField("number", formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    autoComplete="cc-number"
                  />
                  <FieldError message={cardErrors.number} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cc-expiry">Validade</Label>
                    <Input
                      id="cc-expiry"
                      inputMode="numeric"
                      value={card.expiry}
                      onChange={(e) => setCardField("expiry", formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      autoComplete="cc-exp"
                    />
                    <FieldError message={cardErrors.expiry} />
                  </div>
                  <div>
                    <Label htmlFor="cc-cvc">CVC</Label>
                    <Input
                      id="cc-cvc"
                      inputMode="numeric"
                      value={card.cvc}
                      onChange={(e) => setCardField("cvc", digitsOnly(e.target.value).slice(0, 4))}
                      placeholder="123"
                      autoComplete="cc-csc"
                    />
                    <FieldError message={cardErrors.cvc} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cc-country">País</Label>
                    <select
                      id="cc-country"
                      value={card.country}
                      onChange={(e) => setCardField("country", e.target.value)}
                      className="w-full rounded-lg border border-brand-200 bg-white px-4 py-3 text-brand-900 focus-ring"
                      autoComplete="country-name"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <FieldError message={cardErrors.country} />
                  </div>
                  <div>
                    <Label htmlFor="cc-postal">Código Postal</Label>
                    <Input
                      id="cc-postal"
                      value={card.postal}
                      onChange={(e) => setCardField("postal", e.target.value)}
                      placeholder="0000-000"
                      autoComplete="postal-code"
                    />
                    <FieldError message={cardErrors.postal} />
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-2 text-sm text-brand-700">
                    <input
                      type="checkbox"
                      checked={card.terms}
                      onChange={(e) => setCardField("terms", e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-brand-300 text-brand-600 focus-ring"
                    />
                    <span>
                      Aceito que a minha contribuição seja destinada ao projeto Adote uma Alma e
                      autorizo o processamento dos meus dados para este fim.
                    </span>
                  </label>
                  <FieldError message={cardErrors.terms} />
                </div>
              </div>

              <FieldError message={error ?? undefined} />

              <Button className="mt-6 w-full" disabled={submitting} onClick={startCardCheckout}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> A redirecionar...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Pagar {formatCurrency(finalAmount)}
                  </>
                )}
              </Button>

              <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-brand-400">
                <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                Por segurança, a confirmação final do cartão é feita na página encriptada da
                Stripe. Os dados do cartão nunca são guardados nos nossos servidores.
              </p>
            </div>
          )}

          {step === "comprovativo" && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-brand-900">Enviar comprovativo</h2>
              <p className="mt-1 text-sm text-brand-600">
                Confirme os seus dados. A sua contribuição será validada pela nossa equipa.
              </p>

              <div className="mt-5">
                <Label htmlFor="donor-name">O seu nome</Label>
                <Input
                  id="donor-name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="proof">Comprovativo do pagamento</Label>
                <label
                  htmlFor="proof"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-brand-300 px-4 py-6 text-sm text-brand-600 hover:bg-brand-50"
                >
                  <Upload className="h-4 w-4" aria-hidden />
                  {file ? file.name : "Clique para anexar imagem ou PDF"}
                </label>
                <input
                  id="proof"
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>

              <FieldError message={error ?? undefined} />

              <Button type="submit" className="mt-6 w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> A enviar...
                  </>
                ) : (
                  "Confirmar contribuição"
                )}
              </Button>
            </form>
          )}

          {step === "sucesso" && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-brand-900">Obrigado, {donorName}!</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">
                A sua contribuição de {formatCurrency(finalAmount)} foi registada e está a
                aguardar confirmação da nossa equipa. Assim que for validada, o progresso da
                Alma #{soul.code} será atualizado.
              </p>
              <Button className="mt-6 w-full" variant="secondary" onClick={onClose}>
                Fechar
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
