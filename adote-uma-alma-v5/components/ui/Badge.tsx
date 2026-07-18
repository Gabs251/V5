import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "pending" | "danger";
  className?: string;
}) {
  const styles = {
    default: "bg-brand-100 text-brand-700",
    success: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
