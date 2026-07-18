"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  percentage,
  className,
}: {
  percentage: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-brand-100", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}
