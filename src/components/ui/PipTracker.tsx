"use client";

import React from "react";

interface PipTrackerProps {
  label: string;
  max: number;
  used: number;
  color?: string;
  onToggle: (index: number) => void;
}

export default function PipTracker({
  label,
  max,
  used,
  color = "bg-accent",
  onToggle,
}: PipTrackerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-body text-text-secondary min-w-0 shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {Array.from({ length: max }).map((_, i) => {
          const isAvailable = i >= used;
          return (
            <button
              key={i}
              onClick={() => onToggle(i)}
              aria-label={`${label} pip ${i + 1}: ${isAvailable ? "available" : "spent"}`}
              className={`w-4 h-4 rounded-full border transition-colors duration-150 cursor-pointer ${
                isAvailable
                  ? `${color} border-transparent`
                  : "bg-transparent border-border-subtle"
              } hover:opacity-80`}
            />
          );
        })}
      </div>
      <span className="text-xs text-text-secondary font-mono ml-1">
        {max - used}/{max}
      </span>
    </div>
  );
}
