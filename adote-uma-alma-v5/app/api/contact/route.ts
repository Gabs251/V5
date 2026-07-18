import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ error: "Não foi possível enviar a mensagem." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
