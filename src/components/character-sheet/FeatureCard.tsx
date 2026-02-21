"use client";

import React, { useState } from "react";
import { PipTracker } from "@/components/ui";

interface FeatureCardProps {
  name: string;
  description: string;
  source?: string;
  variant?: "default" | "fate" | "accent";
  resourceKey?: string;
  maxUses?: number;
  usedCount?: number;
  onResourceToggle?: (index: number) => void;
}

const SOURCE_STYLES: Record<string, string> = {
  "Table B": "bg-accent/20 text-accent border border-accent/40",
  "Chaos Form": "bg-accent/20 text-accent border border-accent/40",
  "Stabilized Form": "bg-fate/20 text-fate-glow border border-fate/40",
  "Residual Memory": "bg-fate/20 text-fate-glow border border-fate/40",
  "Table D": "bg-bg-elevated text-text-secondary border border-border-subtle",
};

function getSourceStyle(source?: string): string {
  if (!source) return "";
  for (const [key, style] of Object.entries(SOURCE_STYLES)) {
    if (source.includes(key)) return style;
  }
  return "bg-bg-elevated text-text-secondary border border-border-subtle";
}

export default function FeatureCard({
  name,
  description,
  source,
  variant = "default",
  resourceKey,
  maxUses,
  usedCount = 0,
  onResourceToggle,
}: FeatureCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const borderClass =
    variant === "accent"
      ? "border-l-4 border-accent"
      : variant === "fate"
      ? "border-l-4 border-fate"
      : "";

  const bgClass =
    variant === "accent"
      ? "bg-accent/5"
      : variant === "fate"
      ? "bg-fate/5"
      : "bg-bg-surface";

  return (
    <div
      className={`rounded shadow-sm mb-2 last:mb-0 overflow-hidden ${borderClass} ${bgClass} border border-border-subtle`}
    >
      <button
        className="w-full text-left px-3 py-2"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-text-secondary text-xs shrink-0">
              {isOpen ? "▾" : "▸"}
            </span>
            <span className="text-sm font-condensed font-bold text-text-primary truncate">
              {name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {resourceKey && maxUses && onResourceToggle && (
              <div onClick={(e) => e.stopPropagation()}>
                <PipTracker
                  label=""
                  max={maxUses}
                  used={usedCount}
                  onToggle={onResourceToggle}
                />
              </div>
            )}
            {source && (
              <span
                className={`text-xs font-condensed px-1.5 py-0.5 rounded whitespace-nowrap ${getSourceStyle(source)}`}
              >
                {source}
              </span>
            )}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-3 pb-3 border-t border-border-subtle pt-2">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
