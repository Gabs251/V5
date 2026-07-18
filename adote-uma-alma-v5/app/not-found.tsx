import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Erro 404</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-900">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-brand-600">
        A página que procura pode ter sido movida ou já não existe.
      </p>
      <Button className="mt-6" asChild={false}>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
