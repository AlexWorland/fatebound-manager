"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface DiceRollerProps {
  sides: number;
  onRollComplete: (result: number) => void;
  label?: string;
  autoRoll?: boolean;
}

type Phase = "waiting" | "rolling" | "result";

export default function DiceRoller({
  sides,
  onRollComplete,
  label,
  autoRoll = false,
}: DiceRollerProps) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const rollStartRef = useRef<number>(0);

  const roll = useCallback(() => {
    if (phase === "rolling") return;

    const result = Math.floor(Math.random() * sides) + 1;
    setFinalResult(result);
    setPhase("rolling");
    rollStartRef.current = performance.now();

    const ROLL_DURATION = 1000; // ms
    const COUNT_UP_DURATION = 400; // ms after rolling ends

    // Shake animation phase
    const shakeInterval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * sides) + 1);
    }, 80);

    setTimeout(() => {
      clearInterval(shakeInterval);

      // Count-up phase
      const countStart = performance.now();
      function countUp(now: number) {
        const elapsed = now - countStart;
        const progress = Math.min(elapsed / COUNT_UP_DURATION, 1);
        const current = Math.floor(1 + (result - 1) * progress);
        setDisplayValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(countUp);
        } else {
          setDisplayValue(result);
          setPhase("result");
          onRollComplete(result);
        }
      }

      rafRef.current = requestAnimationFrame(countUp);
    }, ROLL_DURATION);
  }, [phase, sides, onRollComplete]);

  // Auto-roll on mount if requested
  useEffect(() => {
    if (autoRoll) {
      roll();
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reset() {
    if (phase === "rolling") return;
    setPhase("waiting");
    setDisplayValue(null);
    setFinalResult(null);
  }

  const isRolling = phase === "rolling";

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
          {label}
        </span>
      )}

      <button
        onClick={phase === "result" ? reset : roll}
        disabled={isRolling}
        aria-label={`Roll d${sides}`}
        className={`
          relative w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center
          transition-all duration-150 select-none cursor-pointer
          ${isRolling ? "animate-shake border-fate bg-bg-elevated" : ""}
          ${phase === "waiting" ? "border-border-subtle bg-bg-elevated hover:border-fate hover:bg-bg-hover" : ""}
          ${phase === "result" ? "border-accent bg-bg-elevated hover:opacity-80" : ""}
          ${isRolling ? "pointer-events-none" : ""}
        `}
      >
        {/* Die type label */}
        <span className="text-xs font-mono text-text-secondary absolute top-1 left-0 right-0 text-center">
          d{sides}
        </span>

        {/* Value */}
        <span
          className={`text-2xl font-bold font-heading leading-none mt-2 ${
            phase === "result" ? "text-accent" : "text-text-primary"
          }`}
        >
          {phase === "waiting" ? "?" : displayValue ?? "?"}
        </span>

        {/* Rolling indicator dots */}
        {isRolling && (
          <div className="absolute bottom-1 flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-fate animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </button>

      {phase === "result" && finalResult !== null && (
        <span className="text-xs text-text-secondary font-body">tap to reset</span>
      )}

      {/* Shake keyframes injected via style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, -2px) rotate(-3deg); }
          20% { transform: translate(2px, -1px) rotate(3deg); }
          30% { transform: translate(-1px, 2px) rotate(-2deg); }
          40% { transform: translate(1px, 2px) rotate(2deg); }
          50% { transform: translate(-2px, 1px) rotate(-3deg); }
          60% { transform: translate(2px, -2px) rotate(3deg); }
          70% { transform: translate(-1px, -1px) rotate(-1deg); }
          80% { transform: translate(1px, 1px) rotate(1deg); }
          90% { transform: translate(-1px, 2px) rotate(-2deg); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
