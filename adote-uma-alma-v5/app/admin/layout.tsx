import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, ReceiptText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/admin/SignOutButton";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "gprocopio2020@gmail.com").toLowerCase();

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/almas", label: "Almas", icon: Users },
  { href: "/admin/contribuicoes", label: "Contribuições", icon: ReceiptText },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if ((user.email ?? "").toLowerCase() !== ADMIN_EMAIL) redirect("/");

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <nav className="space-y-1 rounded-xl2 border border-brand-100 bg-white p-3 shadow-soft">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          ))}
          <SignOutButton>
            <LogOut className="h-4 w-4" aria-hidden />
            Sair
          </SignOutButton>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
