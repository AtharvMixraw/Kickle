"use client";

import { useEffect, useState } from "react";

function getNextUtcMidnight(now = new Date()) {
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0
  ));
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    `${hours.toString().padStart(2, "0")}h`,
    `${minutes.toString().padStart(2, "0")}m`,
    `${seconds.toString().padStart(2, "0")}s`,
  ].join(" ");
}

interface NextGridCountdownProps {
  className?: string;
}

export default function NextGridCountdown({ className = "" }: NextGridCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(() => getNextUtcMidnight().getTime() - Date.now());

  useEffect(() => {
    const update = () => {
      setRemainingMs(getNextUtcMidnight().getTime() - Date.now());
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={`rounded-2xl border border-[#36e27b]/25 bg-[#36e27b]/8 px-4 py-4 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#36e27b] mb-2">
        Next Grid Countdown
      </p>
      <p className="text-sm sm:text-base text-white font-semibold leading-relaxed">
        Next grid goes live in{" "}
        <span className="font-mono text-[#36e27b] tabular-nums">{formatCountdown(remainingMs)}</span>
        .
      </p>
      <p className="mt-2 text-xs text-white/60">
        Come back when the timer hits zero.
      </p>
    </div>
  );
}
