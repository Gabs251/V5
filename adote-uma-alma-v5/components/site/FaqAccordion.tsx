"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-100 rounded-xl2 border border-brand-100 bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-ring"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="font-medium text-brand-900">{item.question}</span>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 text-brand-500 transition-transform", isOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm leading-relaxed text-brand-600">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
