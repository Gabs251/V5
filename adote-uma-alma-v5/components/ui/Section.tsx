import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-12 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-brand-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-brand-700">{description}</p>
      )}
    </div>
  );
}
