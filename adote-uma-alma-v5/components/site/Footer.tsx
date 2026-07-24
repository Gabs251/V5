import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/site/Logo";

const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "gp.portugal";

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={44} />
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Um projeto da Igreja Internacional Geração Profética. Cada contribuição é
            destinada integralmente a levar pessoas ao Encontro com Deus Redenção.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Navegar
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-700">
            <li><Link href="/adote-uma-alma" className="hover:text-brand-900">Almas</Link></li>
            <li><Link href="/quem-somos" className="hover:text-brand-900">Quem Somos</Link></li>
            <li><Link href="/transparencia" className="hover:text-brand-900">Transparência</Link></li>
            <li><Link href="/faq" className="hover:text-brand-900">Perguntas Frequentes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-700">
            <li>
              <a href="tel:+351922262241" className="flex items-center gap-2 hover:text-brand-900">
                <Phone className="h-4 w-4" aria-hidden />+351 922 262 241
              </a>
              <span className="ml-6 block text-xs text-brand-400">Telefone</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden />
              <a href="mailto:geral@adoteumaalma.pt" className="hover:text-brand-900">
                geral@adoteumaalma.pt
              </a>
            </li>
            <li>
              <Link href="/contato" className="hover:text-brand-900">Formulário de contacto</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Redes sociais
          </h3>
          <a
            href={"https://instagram.com/" + instagramHandle}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900"
          >
            <Instagram className="h-4 w-4" aria-hidden />@{instagramHandle}
          </a>
        </div>
      </div>

      <div className="border-t border-brand-100 py-6">
        <p className="container-page text-center text-xs text-brand-500">
          © {new Date().getFullYear()} Adote uma Alma. Todos os direitos reservados. Feito
          com fé, para as nações.
        </p>
      </div>
    </footer>
  );
}
