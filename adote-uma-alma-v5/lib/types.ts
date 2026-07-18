export type SoulStatus = "disponivel" | "adotada" | "arquivada";
export type ContributionStatus = "pendente" | "confirmada" | "rejeitada";

export interface Soul {
  id: string;
  code: string;
  age: number | null;
  country: string;
  extra_info: string | null;
  description: string;
  image_url: string | null;
  goal_cents: number;
  raised_cents: number;
  status: SoulStatus;
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  soul_id: string;
  donor_name: string;
  amount_cents: number;
  proof_url: string | null;
  status: ContributionStatus;
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface TransparencyTotals {
  totalRaisedCents: number;
  totalGoalCents: number;
  soulsCount: number;
  contributionsCount: number;
  percentage: number;
}
