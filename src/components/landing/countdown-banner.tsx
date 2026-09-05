"use client";

import { useState, useEffect, useRef } from "react";

const calculateTimeLeft = (target: Date) => {
  const d = +target - +new Date();
  let tl = { hours: 0, minutes: 0, seconds: 0 };
  if (d > 0) {
    tl = {
      hours: Math.floor((d / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((d / 1000 / 60) % 60),
      seconds: Math.floor((d / 1000) % 60),
    };
  }
  return tl;
};

const getTargetDate = () => {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const diffH = (end.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffH < 48) return new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
  return end;
};

function FlipCard({ value, label, tick }: { value: string; label: string; tick: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative w-[88px] h-[74px] md:w-[108px] md:h-[88px] rounded-[14px] bg-white border-2 border-[#1d1a15] shadow-[0_4px_0_#1d1a15] overflow-hidden ${tick ? "animate-[flip_520ms_cubic-bezier(0.32,0.72,0,1)]" : ""}`}
        aria-hidden="true"
      >
        {/* split background */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-white border-b border-[#1d1a15]/10" />
          <div className="flex-1 bg-[#fffbeb]" />
        </div>
        {/* single number centered over hinge */}
        <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-[2rem] md:text-[2.55rem] leading-none tracking-[-0.02em] text-[#1d1a15]">
          {value}
        </span>
        {/* hinge */}
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-[#1d1a15] -translate-y-1/2" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ffe14d] border-2 border-[#1d1a15]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-[#ffe14d] border-2 border-[#1d1a15]" />
      </div>
      <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-[#1d1a15]/70">{label}</span>
    </div>
  );
}

export function CountdownBanner() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [tl, setTl] = useState({ hours: 6, minutes: 19, seconds: 32 });
  const [tickKey, setTickKey] = useState(0);
  const prev = useRef(tl);

  useEffect(() => setTargetDate(getTargetDate()), []);

  useEffect(() => {
    if (!targetDate) return;
    const id = window.setInterval(() => {
      const n = calculateTimeLeft(targetDate);
      if (n.seconds !== prev.current.seconds) setTickKey((k) => k + 1);
      prev.current = n;
      setTl(n);
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return null;
  const f = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[0.82rem] font-bold tracking-[0.14em] uppercase text-[#1d1a15]/70">Rabatt endet in</p>
      <div className="flex items-center gap-2 md:gap-3" role="timer" aria-live="off" aria-label={`${f(tl.hours)} Stunden ${f(tl.minutes)} Minuten ${f(tl.seconds)} Sekunden`}>
        <FlipCard value={f(tl.hours)} label="Std" tick={tickKey % 2 === 0} />
        <span className="font-mono font-black text-[1.7rem] md:text-[2rem] text-[#1d1a15] -mt-6 opacity-70">:</span>
        <FlipCard value={f(tl.minutes)} label="Min" tick={tickKey % 2 === 1} />
        <span className="font-mono font-black text-[1.7rem] md:text-[2rem] text-[#1d1a15] -mt-6 opacity-70">:</span>
        <FlipCard value={f(tl.seconds)} label="Sek" tick={true} key={tickKey} />
      </div>
      <style>{`@keyframes flip{0%{transform:rotateX(0) scale(1)}18%{transform:rotateX(-14deg) scale(1.02)}42%{transform:rotateX(10deg)}100%{transform:rotateX(0) scale(1)}}`}</style>
    </div>
  );
}
