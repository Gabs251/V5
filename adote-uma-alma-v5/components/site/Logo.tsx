import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  size = 40,
  withText = true,
  className,
}: {
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="Igreja Internacional Geração Profética — Paternidade às Nações"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      {withText && (
        <span className="text-lg font-semibold tracking-tight text-brand-800">
          Adote uma Alma
        </span>
      )}
    </span>
  );
}
