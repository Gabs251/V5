cd /Users/nataneprocopio/Downloads/adote-uma-alma-v5/V5-1/adote-uma-alma-v5

cat > app/api/webhooks/stripe/route.ts <<'EOF'
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
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

  if (!signature) {
    return NextResponse.json(
      { error: "Sem assinatura Stripe." },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe signature error:", error);

    return NextResponse.json(
      { error: "Assinatura inválida." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // PAGAMENTO CONFIRMADO
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const soulId = session.metadata?.soul_id;
    const donorName =
      session.metadata?.donor_name || "Doação Stripe";

    const amountCents = session.amount_total ?? 0;

    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null;

    if (
      soulId &&
      amountCents > 0 &&
      session.payment_status === "paid"
    ) {
      const { data: existing } = await supabase
        .from("contributions")
        .select("id")
        .eq("stripe_payment_intent", paymentIntent)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from("contributions")
          .insert({
            soul_id: soulId,
            donor_name: donorName,
            amount_cents: amountCents,
            status: "confirmada",
            stripe_payment_intent: paymentIntent,
            admin_note: "Stripe: " + session.id,
          });

        if (error) {
          console.error("Erro Supabase:", error);

          return NextResponse.json(
            { error: "Erro ao guardar pagamento." },
            { status: 500 }
          );
        }
      }
    }
  }

  // REEMBOLSO
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    const paymentIntent =
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : null;

    if (paymentIntent) {
      const { data: contribution } = await supabase
        .from("contributions")
        .select("*")
        .eq("stripe_payment_intent", paymentIntent)
        .maybeSingle();

      if (contribution) {
        await supabase
          .from("contributions")
          .update({
            status: "reembolsada",
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", contribution.id);
      }
    }
  }

  return NextResponse.json({
    received: true,
  });
}
EOF