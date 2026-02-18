"use client";

import React from "react";
import { PipTracker } from "@/components/ui";
import FeatureCard from "./FeatureCard";
import ResidualMemory from "./ResidualMemory";
import type { DailyState, ResourceTracker } from "@/types/character";

interface Feature {
  name: string;
  description: string;
  source?: string;
  resourceKey?: string;
}

interface FeaturesTabProps {
  dailyState: DailyState | null;
  features: Feature[];
  onResourceToggle: (resourceKey: string, index: number) => void;
}

function ResourceSection({
  resources,
  onToggle,
}: {
  resources: Record<string, ResourceTracker>;
  onToggle: (key: string, index: number) => void;
}) {
  const entries = Object.entries(resources);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-4 bg-bg-surface border border-border-subtle rounded-lg">
      <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest">
        Class Resources
      </h3>
      {entries.map(([key, tracker]) => (
        <PipTracker
          key={key}
          label={key}
          max={tracker.max}
          used={tracker.used}
          color="bg-accent"
          onToggle={(i) => onToggle(key, i)}
        />
      ))}
    </div>
  );
}

export default function FeaturesTab({
  dailyState,
  features,
  onResourceToggle,
}: FeaturesTabProps) {
  const classResources = dailyState?.classResources ?? {};
  const residualSlots = dailyState?.residualMemorySlots ?? [];

  // Fate-pool special resources
  const fateResources: { label: string; key: string; used: boolean }[] = [
    {
      label: "Chaos Surge",
      key: "chaosSurge",
      used: dailyState?.chaosSurgeUsed ?? false,
    },
    {
      label: "Twist of Fate",
      key: "twistOfFate",
      used: dailyState?.twistOfFateUsed ?? false,
    },
    {
      label: "Defy Fate",
      key: "defyFate",
      used: dailyState?.defyFateUsed ?? false,
    },
  ].filter(({ used: _ }) => true); // always show all

  return (
    <div className="flex flex-col gap-4">
      {/* Fate Resources */}
      {dailyState && (
        <div className="flex flex-col gap-2 p-4 bg-bg-surface border border-fate/40 rounded-lg">
          <h3 className="text-xs font-body text-fate-glow uppercase tracking-widest">
            Fate Powers
          </h3>
          <div className="flex flex-wrap gap-3">
            {fateResources.map(({ label, used }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full border ${
                    used
                      ? "bg-transparent border-border-subtle"
                      : "bg-fate border-fate"
                  }`}
                />
                <span
                  className={`text-sm font-body ${
                    used ? "text-text-secondary line-through" : "text-text-highlight"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Resources */}
      {Object.keys(classResources).length > 0 && (
        <ResourceSection resources={classResources} onToggle={onResourceToggle} />
      )}

      {/* Residual Memory */}
      {residualSlots.length > 0 && <ResidualMemory slots={residualSlots} />}

      {/* Feature Cards */}
      {features.length > 0 ? (
        <div className="flex flex-col gap-2">
          {features.map((feature, i) => (
            <FeatureCard
              key={`${feature.name}-${i}`}
              name={feature.name}
              description={feature.description}
              source={feature.source}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-text-secondary font-body py-8">
          No features for today&apos;s form. Complete a Dawn Roll to generate your form.
        </div>
      )}
    </div>
  );
}
