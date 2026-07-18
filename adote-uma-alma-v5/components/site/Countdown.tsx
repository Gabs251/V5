"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
    ended: diff <= 0,
  };
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="h-[76px]" aria-hidden />;
  }

  if (timeLeft.ended) {
    return (
      <p className="text-sm font-medium text-brand-600">
        O Encontro com Deus Redenção já começou. Continue a apoiar as próximas almas!
      </p>
    );
  }

  const units = [
    { label: "Dias", value: timeLeft.dias },
    { label: "Horas", value: timeLeft.horas },
    { label: "Min", value: timeLeft.minutos },
    { label: "Seg", value: timeLeft.segundos },
  ];

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-5"
      role="timer"
      aria-label={`Faltam ${timeLeft.dias} dias, ${timeLeft.horas} horas, ${timeLeft.minutos} minutos e ${timeLeft.segundos} segundos para o Encontro com Deus Redenção`}
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-16 flex-col items-center rounded-xl2 bg-white/80 py-3 shadow-soft sm:w-20"
        >
          <span className="text-2xl font-bold tabular-nums text-brand-700 sm:text-3xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-brand-500 sm:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
