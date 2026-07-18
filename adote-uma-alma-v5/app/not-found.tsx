import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold">404</h1>

      <p className="mt-4 text-muted-foreground">
        A página que procura pode ter sido movida ou já não existe.
      </p>

      <Link href="/">
        <Button className="mt-6">
          Voltar ao início
        </Button>
      </Link>
    </div>
  );
}