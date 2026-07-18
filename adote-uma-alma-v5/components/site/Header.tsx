"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/Logo";

const links = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/adote-uma-alma", label: "Adote uma Alma" },
  { href: "/transparencia", label: "Transparência" },
  { href: "/investimentos", label: "Investimentos" },
  { href: "/faq", label: "Perguntas Frequentes" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-brand-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" aria-label="Adote uma Alma — Início" className="shrink-0">
          <Logo size={44} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 hover:text-brand-900",
                pathname === link.href && "bg-brand-100 text-brand-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/adote-uma-alma"
            className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-brand-700 focus-ring"
          >
            Adotar Agora
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-brand-800 focus-ring lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand-100 bg-brand-50 lg:hidden" aria-label="Navegação móvel">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium text-brand-700 hover:bg-brand-100",
                  pathname === link.href && "bg-brand-100 text-brand-900"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/adote-uma-alma"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
            >
              Adotar Agora
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
