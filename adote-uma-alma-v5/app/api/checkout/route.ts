import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSoulById } from "@/lib/data";

function emailValid(value: string): boolean {
  const at = value.indexOf("@");
  if (at < 1) return false;
  const domain = value.slice(at + 1);
  return domain.includes(".") && domain.length >= 3 && !value.includes(" ");
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Pagamento por cartão indisponível de momento." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const soulId = typeof body?.soul_id === "string" ? body.soul_id : null;
  const donorName = typeof body?.donor_name === "string" ? body.donor_name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const amountCents = Number.isInteger(body?.amount_cents) ? body.amount_cents : 0;

  if (!soulId || donorName.length < 2 || amountCents < 100 || amountCents > 1000000) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (!emailValid(email)) {
    return NextResponse.json({ error: "Indique um email válido." }, { status: 400 });
  }

  const soul = await getSoulById(soulId);
  if (!soul) {
    return NextResponse.json({ error: "Alma não encontrada." }, { status: 404 });
  }

  const stripe = new Stripe(secretKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Adote uma Alma — Alma #" + soul.code,
            description: "Contribuição para o Encontro com Deus Redenção",
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: { soul_id: soulId, donor_name: donorName, phone: phone },
    success_url: siteUrl + "/obrigado",
    cancel_url: siteUrl + "/adote-uma-alma",
  });

  if (!session.url) {
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
