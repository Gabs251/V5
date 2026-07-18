import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-brand-100 bg-white shadow-card transition-shadow hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
