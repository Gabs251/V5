"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { soulSchema } from "@/lib/validations";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "gprocopio2020@gmail.com").toLowerCase();

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  if ((user.email ?? "").toLowerCase() !== ADMIN_EMAIL) redirect("/");
  return supabase;
}

function soulDataFromForm(formData: FormData) {
  const ageValue = String(formData.get("age") ?? "").trim();
  return {
    code: String(formData.get("code") ?? ""),
    age: ageValue ? Number(ageValue) : null,
    country: String(formData.get("country") ?? ""),
    extra_info: (formData.get("extra_info") as string) || null,
    description: String(formData.get("description") ?? ""),
    image_url: (formData.get("image_url") as string) || null,
    goal_cents: Math.round(Number(formData.get("goal") ?? 0) * 100),
    raised_cents: Math.round(Number(formData.get("raised") ?? 0) * 100),
    status: (formData.get("status") as string) || "disponivel",
  };
}

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/adote-uma-alma");
  revalidatePath("/transparencia");
}

export async function createSoul(formData: FormData) {
  const supabase = await requireAdmin();
  const parsed = soulSchema.safeParse(soulDataFromForm(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }
  const { error } = await supabase.from("souls").insert(parsed.data);
  if (error) throw new Error("Não foi possível criar a alma.");
  revalidatePath("/admin/almas");
  revalidatePublicPages();
}

export async function updateSoul(soulId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const parsed = soulSchema.safeParse(soulDataFromForm(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }
  const { error } = await supabase.from("souls").update(parsed.data).eq("id", soulId);
  if (error) throw new Error("Não foi possível atualizar a alma.");
  revalidatePath("/admin/almas");
  revalidatePublicPages();
}

export async function archiveSoul(soulId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("souls").update({ status: "arquivada" }).eq("id", soulId);
  if (error) throw new Error("Não foi possível arquivar a alma.");
  revalidatePath("/admin/almas");
  revalidatePublicPages();
}

export async function confirmContribution(contributionId: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("contributions")
    .update({ status: "confirmada" })
    .eq("id", contributionId);
  if (error) throw new Error("Não foi possível confirmar a contribuição.");
  revalidatePath("/admin/contribuicoes");
  revalidatePublicPages();
}

export async function rejectContribution(contributionId: string, note?: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("contributions")
    .update({ status: "rejeitada", admin_note: note ?? null })
    .eq("id", contributionId);
  if (error) throw new Error("Não foi possível rejeitar a contribuição.");
  revalidatePath("/admin/contribuicoes");
}

export async function updateProjectSettings(formData: FormData) {
  const supabase = await requireAdmin();

  const entries = [
    { key: "mbway_number", value: String(formData.get("mbway_number") ?? "") },
    { key: "event_date", value: String(formData.get("event_date") ?? "") },
    { key: "nations_reached", value: String(formData.get("nations_reached") ?? "") },
  ].filter((e) => e.value.trim() !== "");

  if (entries.length > 0) {
    await supabase.from("site_settings").upsert(entries);
  }

  // Permitir limpar o override de nações (voltar ao automático)
  if (String(formData.get("nations_reached") ?? "").trim() === "") {
    await supabase.from("site_settings").delete().eq("key", "nations_reached");
  }

  revalidatePath("/admin");
  revalidatePublicPages();
}
