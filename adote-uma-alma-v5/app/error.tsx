"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Ocorreu um erro</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-900">Algo correu mal</h1>
      <p className="mt-3 max-w-md text-brand-600">
        Pedimos desculpa pelo incómodo. Pode tentar novamente.
      </p>
      <Button className="mt-6" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
