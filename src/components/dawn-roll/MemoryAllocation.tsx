"use client";

import React, { useState, useCallback } from "react";
import { getMemorySlotCount, getFatePoolSize } from "@/engine/residual-memory";
import type { RetainableFeature, MemoryCategory } from "@/types/features";
import type { MemorySlot } from "@/types/features";

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  1: "Combat Style",
  2: "Resource Pool",
  3: "Scaling Damage",
  4: "Spell Slots",
  5: "Passive",
  6: "Proficiency",
};

const CATEGORY_COLORS: Record<MemoryCategory, string> = {
  1: "bg-red-900/50 text-red-300 border-red-800",
  2: "bg-blue-900/50 text-blue-300 border-blue-800",
  3: "bg-orange-900/50 text-orange-300 border-orange-800",
  4: "bg-purple-900/50 text-purple-300 border-purple-800",
  5: "bg-green-900/50 text-green-300 border-green-800",
  6: "bg-bg-elevated text-text-secondary border-border-subtle",
};

export interface MemoryAllocationResult {
  retainedFeatures: MemorySlot[];
  useDualNature: boolean;
}

interface MemoryAllocationProps {
  level: number;
  yesterdaysFeatures: RetainableFeature[];
  onComplete: (result: MemoryAllocationResult) => void;
}

export default function MemoryAllocation({
  level,
  yesterdaysFeatures,
  onComplete,
}: MemoryAllocationProps) {
  const memorySlots = getMemorySlotCount(level);
  const fatePool = getFatePoolSize(level);
  const canUseDualNature = level >= 11;
  const budget = level >= 11 ? fatePool : memorySlots;

  const [retained, setRetained] = useState<Set<string>>(new Set());
  const [useDualNature, setUseDualNature] = useState(false);

  const dualNatureCost = useDualNature ? 2 : 0;
  const featureCost = retained.size;
  const pointsUsed = featureCost + dualNatureCost;
  const pointsRemaining = budget - pointsUsed;
  const budgetFull = pointsRemaining <= 0;

  const retainableFeatures = yesterdaysFeatures.filter((f) => f.category !== 6);

  function toggleFeature(featureId: string) {
    setRetained((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        if (pointsRemaining <= 0) return prev; // budget exhausted
        if (next.size >= memorySlots) return prev; // memory slot cap
        next.add(featureId);
      }
      return next;
    });
  }

  function toggleDualNature() {
    if (!canUseDualNature) return;
    if (!useDualNature && pointsRemaining < 2) return; // not enough points
    setUseDualNature((v) => !v);
  }

  function handleConfirm() {
    const retainedFeatures: MemorySlot[] = retainableFeatures
      .filter((f) => retained.has(f.featureId))
      .map((f) => ({
        featureId: f.featureId,
        name: f.name,
        category: f.category,
        source: f.source,
      }));

    onComplete({ retainedFeatures, useDualNature });
  }

  // Pool bar color
  const fillPercent = budget > 0 ? Math.min((pointsUsed / budget) * 100, 100) : 0;
  const barColor =
    fillPercent >= 100
      ? "bg-accent"
      : fillPercent >= 75
      ? "bg-orange-500"
      : fillPercent >= 50
      ? "bg-yellow-500"
      : "bg-fate";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-text-primary">Memory Allocation</h2>
        <p className="text-sm text-text-secondary font-body">
          Select features from yesterday to retain as Residual Memory.
        </p>
      </div>

      {/* Fate Pool budget bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-body">
          <span className="text-text-secondary uppercase tracking-widest">
            {canUseDualNature ? "Fate Pool" : "Memory Slots"}
          </span>
          <span className="text-text-primary">
            {pointsUsed} / {budget} used
          </span>
        </div>
        <div className="h-2 bg-bg-elevated rounded-full overflow-hidden border border-border-subtle">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-body text-text-secondary">
          <span>{memorySlots} memory slot{memorySlots !== 1 ? "s" : ""}</span>
          <span>{pointsRemaining} remaining</span>
        </div>
      </div>

      {/* Feature list */}
      {retainableFeatures.length === 0 ? (
        <p className="text-center text-text-secondary font-body text-sm py-4">
          No retainable features from yesterday.
        </p>
      ) : (
        <div className="space-y-2">
          {retainableFeatures.map((feature) => {
            const isRetained = retained.has(feature.featureId);
            const isDisabled = !isRetained && (budgetFull || retained.size >= memorySlots);

            return (
              <button
                key={feature.featureId}
                onClick={() => toggleFeature(feature.featureId)}
                disabled={isDisabled}
                className={`
                  w-full text-left rounded-lg border p-3 transition-all duration-150
                  ${isRetained
                    ? "border-fate bg-fate/10"
                    : isDisabled
                    ? "border-border-subtle bg-bg-elevated opacity-40 cursor-not-allowed"
                    : "border-border-subtle bg-bg-elevated hover:border-fate/50"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading text-sm text-text-primary">{feature.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[feature.category]}`}>
                        Cat {feature.category}: {CATEGORY_LABELS[feature.category]}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-body mt-0.5">{feature.source}</p>
                    <p className="text-xs text-text-secondary font-body mt-1 line-clamp-2">{feature.description}</p>
                  </div>
                  <div className={`
                    w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5
                    ${isRetained ? "border-fate bg-fate text-white" : "border-border-subtle"}
                  `}>
                    {isRetained && <span className="text-xs font-bold">✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Dual Nature toggle */}
      {canUseDualNature && (
        <div className="border border-border-subtle rounded-lg p-4 space-y-2">
          <button
            onClick={toggleDualNature}
            disabled={!useDualNature && pointsRemaining < 2}
            className={`
              w-full flex items-center justify-between transition-all duration-150
              ${!useDualNature && pointsRemaining < 2 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="text-left">
              <p className="font-heading text-text-primary">Activate Dual Nature</p>
              <p className="text-xs text-text-secondary font-body mt-0.5">
                Manifest a second form — costs 2 Fate Pool points
              </p>
            </div>
            <div className={`
              w-12 h-6 rounded-full border transition-all duration-200 relative flex-shrink-0
              ${useDualNature ? "bg-fate border-fate" : "bg-bg-elevated border-border-subtle"}
            `}>
              <div className={`
                absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200
                ${useDualNature ? "left-6 bg-white" : "left-0.5 bg-text-secondary"}
              `} />
            </div>
          </button>
        </div>
      )}

      {/* Confirm */}
      <div className="flex justify-center">
        <button
          onClick={handleConfirm}
          className="px-8 py-2.5 rounded-lg bg-accent text-white font-body font-medium hover:bg-accent-hover transition-all"
        >
          Confirm Allocation
        </button>
      </div>
    </div>
  );
}
