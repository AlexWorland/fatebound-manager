"use client";

import { Card } from "@/components/ui";
import { BACKGROUNDS, type Background } from "@/data/backgrounds";

export interface BackgroundData {
  name: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

export function BackgroundStep({
  data,
  onChange,
}: {
  data: BackgroundData;
  onChange: (d: BackgroundData) => void;
}) {
  const selected = BACKGROUNDS.find((b) => b.name === data.name) ?? null;

  function selectBackground(bg: Background) {
    onChange({
      name: bg.name,
      personality: bg.personalityTraits[0] ?? "",
      ideals: bg.ideals[0] ?? "",
      bonds: bg.bonds[0] ?? "",
      flaws: bg.flaws[0] ?? "",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Background picker */}
      <Card>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-heading text-text-highlight">Background</h2>
            <p className="text-sm text-text-secondary mt-1">
              Your background defines who you were before fate reshaped you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.name}
                onClick={() => selectBackground(bg)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  data.name === bg.name
                    ? "bg-fate/10 border-fate text-text-highlight"
                    : "bg-bg-elevated border-border-subtle text-text-primary hover:border-fate/50 hover:bg-bg-hover"
                }`}
              >
                <div className="font-heading text-sm font-semibold">{bg.name}</div>
                <div className="text-xs text-text-secondary mt-1">
                  {bg.skillProficiencies.join(", ")}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Personality fields — shown once a background is selected */}
      {selected && (
        <Card>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-heading text-text-secondary uppercase tracking-widest">
              Personality
            </h3>

            <PersonalityField
              label="Personality Trait"
              value={data.personality}
              suggestions={selected.personalityTraits}
              onChange={(v) => onChange({ ...data, personality: v })}
            />
            <PersonalityField
              label="Ideal"
              value={data.ideals}
              suggestions={selected.ideals}
              onChange={(v) => onChange({ ...data, ideals: v })}
            />
            <PersonalityField
              label="Bond"
              value={data.bonds}
              suggestions={selected.bonds}
              onChange={(v) => onChange({ ...data, bonds: v })}
            />
            <PersonalityField
              label="Flaw"
              value={data.flaws}
              suggestions={selected.flaws}
              onChange={(v) => onChange({ ...data, flaws: v })}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

function PersonalityField({
  label,
  value,
  suggestions,
  onChange,
}: {
  label: string;
  value: string;
  suggestions: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-text-secondary font-body uppercase tracking-widest">
        {label}
      </label>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onChange(s)}
              className={`px-2 py-1 rounded text-xs font-body transition-colors ${
                value === s
                  ? "bg-accent/20 border border-accent text-text-highlight"
                  : "bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-subtle/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Custom ${label.toLowerCase()}...`}
        rows={2}
        className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary text-sm font-body placeholder:text-text-secondary/50 focus:outline-none focus:border-fate transition-colors resize-none"
      />
    </div>
  );
}
