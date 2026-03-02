"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "@/components/ui";
import { rollDie } from "@/lib/dice";

interface CombatStatsBarProps {
  ac: number;
  speed?: number;
  initiative: number;
  acBreakdown?: string;
}

function StatBox({
  label,
  value,
  breakdown,
}: {
  label: string;
  value: string | number;
  breakdown?: string;
}) {
  const content = (
    <div className="flex flex-col items-center justify-center bg-bg-elevated border border-border-subtle rounded-lg p-2">
      <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
        {label}
      </span>
      <span className="text-xl font-heading text-text-highlight">
        {typeof value === "number" && value >= 0 ? `+${value}` : value}
      </span>
    </div>
  );

  if (breakdown) {
    return (
      <Tooltip content={breakdown} position="top" delay={200}>
        {content}
      </Tooltip>
    );
  }

  return content;
}

function InitiativeBox({ initiative }: { initiative: number }) {
  const [rollResult, setRollResult] = useState<{
    d20: number;
    total: number;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const modLabel = initiative >= 0 ? `+${initiative}` : `${initiative}`;

  function handleClick() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const d20 = rollDie(20);
    const total = d20 + initiative;
    setRollResult({ d20, total });
    timerRef.current = setTimeout(() => setRollResult(null), 5000);
  }

  // Dismiss on click outside
  useEffect(() => {
    if (!rollResult) return;
    function handleOutsideClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setRollResult(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [rollResult]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex flex-col items-center justify-center bg-bg-elevated border border-border-subtle rounded-lg p-2 cursor-pointer hover:bg-white/5 transition-colors"
        title="Click to roll initiative"
      >
        <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
          Init
        </span>
        <span className="text-xl font-heading text-text-highlight">{modLabel}</span>
      </button>

      {rollResult && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-bg-elevated border border-border-subtle rounded-lg shadow-lg px-3 py-2 whitespace-nowrap text-xs font-body text-text-primary">
          Initiative: d20({rollResult.d20}) {initiative >= 0 ? "+" : ""}
          {initiative} = <span className="font-semibold text-text-highlight">{rollResult.total}</span>
        </div>
      )}
    </div>
  );
}

export default function CombatStatsBar({
  ac,
  speed = 30,
  initiative,
  acBreakdown,
}: CombatStatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatBox label="AC" value={ac} breakdown={acBreakdown} />
      <StatBox label="Speed" value={speed} />
      <InitiativeBox initiative={initiative} />
    </div>
  );
}
