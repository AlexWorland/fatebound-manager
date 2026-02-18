"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui";

interface FeatureCardProps {
  name: string;
  description: string;
  source?: string;
  variant?: "default" | "fate" | "accent";
}

const SOURCE_STYLES: Record<string, string> = {
  "Table B": "bg-accent/20 text-accent border border-accent/40",
  "Chaos Form": "bg-accent/20 text-accent border border-accent/40",
  "Stabilized Form": "bg-fate/20 text-fate-glow border border-fate/40",
  "Residual Memory": "bg-fate/20 text-fate-glow border border-fate/40",
  "Tempest Subclass": "bg-blue-500/20 text-blue-400 border border-blue-500/40",
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
}: FeatureCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card variant={variant} className="cursor-pointer select-none">
      <button
        className="w-full text-left"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className={`text-sm transition-transform duration-150 text-text-secondary ${
                isOpen ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
            <span className="font-body font-semibold text-text-highlight truncate">
              {name}
            </span>
          </div>
          {source && (
            <span
              className={`text-xs font-body px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 ${getSourceStyle(source)}`}
            >
              {source}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-border-subtle">
          <p className="text-sm font-body text-text-secondary leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}
    </Card>
  );
}
