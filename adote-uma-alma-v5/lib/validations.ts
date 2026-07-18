import { z } from "zod";

export const contributionSchema = z.object({
  soul_id: z.string().uuid(),
  donor_name: z.string().min(2, "Indique o seu nome.").max(120),
  amount_cents: z
    .number()
    .int()
    .min(100, "O valor mínimo é 1€.")
    .max(1000000, "Valor demasiado elevado."),
  proof_url: z.string().url("Envie o comprovativo do pagamento."),
});

export type ContributionInput = z.infer<typeof contributionSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Indique o seu nome."),
  email: z.string().email("Indique um email válido."),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const soulSchema = z.object({
  code: z.string().min(1, "Indique um código/identificador para a alma."),
  age: z.number().int().min(1).max(120).nullable(),
  country: z.string().min(2),
  extra_info: z.string().optional().nullable(),
  description: z.string().min(10),
  image_url: z.string().url().optional().nullable(),
  goal_cents: z.number().int().min(100),
  raised_cents: z.number().int().min(0),
  status: z.enum(["disponivel", "adotada", "arquivada"]),
});

export type SoulInput = z.infer<typeof soulSchema>;
