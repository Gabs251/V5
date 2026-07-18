import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  console.log("=== ENV DEBUG ===");
  console.log({
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripe: !!process.env.STRIPE_SECRET_KEY,
    webhook: !!process.env.STRIPE_WEBHOOK_SECRET,
  });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook não configurado." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature ?? "",
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook inválido:", err);
    return NextResponse.json(
      { error: "Assinatura inválida." },
      { status: 400 }
    );
  }

  console.log("Evento:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Session:", {
      id: session.id,
      metadata: session.metadata,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
    });

    const soulId = session.metadata?.soul_id;
    const donorName =
      session.metadata?.donor_name ?? "Doação por cartão";
    const amountCents = session.amount_total ?? 0;

    if (soulId && amountCents > 0 && session.payment_status === "paid") {
      const supabase = createAdminClient();

      const { data: existing } = await supabase
        .from("contributions")
        .select("id")
        .eq("admin_note", "Stripe: " + session.id)
        .maybeSingle();

      if (!existing) {
        const { data: inserted, error } = await supabase
          .from("contributions")
          .insert({
            soul_id: soulId,
            donor_name: donorName,
            amount_cents: amountCents,
            status: "pendente",
            admin_note: "Stripe: " + session.id,
          })
          .select("id")
          .single();

        if (error) {
          console.error(error);
        }

        if (inserted) {
          await supabase
            .from("contributions")
            .update({ status: "confirmada" })
            .eq("id", inserted.id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}