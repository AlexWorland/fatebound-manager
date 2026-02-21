"use client";

import React from "react";

interface PoolTrackerProps {
  label: string;
  max: number;
  used: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function PoolTracker({
  label,
  max,
  used,
  onIncrement,
  onDecrement,
}: PoolTrackerProps) {
  const remaining = max - used;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-body text-text-dark min-w-0 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          disabled={used >= max}
          className="w-6 h-6 rounded-full border border-border-subtle text-text-secondary hover:text-text-highlight hover:border-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm"
        >
          −
        </button>
        <span className="text-sm font-mono text-text-primary min-w-[4ch] text-center">
          {remaining}/{max}
        </span>
        <button
          onClick={onIncrement}
          disabled={used <= 0}
          className="w-6 h-6 rounded-full border border-border-subtle text-text-secondary hover:text-text-highlight hover:border-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}
