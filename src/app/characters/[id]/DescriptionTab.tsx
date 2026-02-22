"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui";

interface DescriptionTabProps {
  characterId: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  alignment: string;
  appearance: {
    age?: string;
    height?: string;
    weight?: string;
    eyes?: string;
    hair?: string;
    skin?: string;
    gender?: string;
  };
  portraitUrl: string | null;
}

const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
  "Unaligned",
];

const APPEARANCE_FIELDS: { key: keyof NonNullable<DescriptionTabProps["appearance"]>; label: string }[] = [
  { key: "age", label: "Age" },
  { key: "height", label: "Height" },
  { key: "weight", label: "Weight" },
  { key: "eyes", label: "Eyes" },
  { key: "hair", label: "Hair" },
  { key: "skin", label: "Skin" },
  { key: "gender", label: "Gender" },
];

function useAutoResize(ref: React.RefObject<HTMLTextAreaElement | null>, value: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref, value]);
}

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  minRows?: number;
}

function AutoResizeTextarea({ value, onChange, onBlur, placeholder, minRows = 3 }: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useAutoResize(ref, value);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={minRows}
      className="w-full bg-bg-elevated border border-border-subtle rounded p-3 text-sm font-body text-text-primary placeholder:text-text-secondary resize-none focus:border-accent/50 focus:outline-none leading-relaxed"
    />
  );
}

export default function DescriptionTab({
  characterId,
  personality: initialPersonality,
  ideals: initialIdeals,
  bonds: initialBonds,
  flaws: initialFlaws,
  backstory: initialBackstory,
  alignment: initialAlignment,
  appearance: initialAppearance,
  portraitUrl: initialPortraitUrl,
}: DescriptionTabProps) {
  const [personality, setPersonality] = useState(initialPersonality);
  const [ideals, setIdeals] = useState(initialIdeals);
  const [bonds, setBonds] = useState(initialBonds);
  const [flaws, setFlaws] = useState(initialFlaws);
  const [backstory, setBackstory] = useState(initialBackstory);
  const [alignment, setAlignment] = useState(initialAlignment);
  const [appearance, setAppearance] = useState(initialAppearance);
  const [portraitUrl, setPortraitUrl] = useState(initialPortraitUrl ?? "");
  const [showPortraitInput, setShowPortraitInput] = useState(false);
  const [portraitInputValue, setPortraitInputValue] = useState(initialPortraitUrl ?? "");

  const patch = useCallback(
    async (fields: Record<string, unknown>) => {
      await fetch(`/api/characters/${characterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
    },
    [characterId]
  );

  const handleAppearanceBlur = useCallback(
    (key: keyof NonNullable<DescriptionTabProps["appearance"]>, value: string) => {
      patch({ appearance: { ...appearance, [key]: value } });
    },
    [appearance, patch]
  );

  const handlePortraitSave = useCallback(async () => {
    const url = portraitInputValue.trim() || null;
    setPortraitUrl(portraitInputValue.trim());
    setShowPortraitInput(false);
    await patch({ portraitUrl: url });
  }, [portraitInputValue, patch]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header: portrait + alignment */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Portrait */}
          <div className="shrink-0">
            <p className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-2">
              Portrait
            </p>
            <div className="w-32 h-40 rounded border border-border-subtle bg-bg-elevated flex items-center justify-center overflow-hidden">
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt="Character portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-text-secondary font-body text-center px-2">
                  No portrait
                </span>
              )}
            </div>
            {showPortraitInput ? (
              <div className="mt-2 flex flex-col gap-1">
                <input
                  type="url"
                  value={portraitInputValue}
                  onChange={(e) => setPortraitInputValue(e.target.value)}
                  placeholder="Enter image URL"
                  className="w-32 bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-xs font-body text-text-primary placeholder:text-text-secondary focus:border-accent/50 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePortraitSave();
                    if (e.key === "Escape") setShowPortraitInput(false);
                  }}
                />
                <div className="flex gap-1">
                  <button
                    onClick={handlePortraitSave}
                    className="flex-1 text-xs font-body px-2 py-1 rounded bg-accent hover:bg-accent-hover text-text-highlight transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowPortraitInput(false)}
                    className="text-xs font-body px-2 py-1 rounded border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setPortraitInputValue(portraitUrl);
                  setShowPortraitInput(true);
                }}
                className="mt-2 w-full text-xs font-body text-accent hover:text-accent-hover transition-colors"
              >
                {portraitUrl ? "Change URL" : "Set Portrait URL"}
              </button>
            )}
          </div>

          {/* Alignment */}
          <div className="flex-1">
            <p className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-2">
              Alignment
            </p>
            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              onBlur={() => patch({ alignment })}
              className="w-full bg-bg-elevated border border-border-subtle rounded p-2 text-sm font-body text-text-primary focus:border-accent/50 focus:outline-none"
            >
              <option value="">— Select alignment —</option>
              {ALIGNMENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Personality traits */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-2">
          Personality Traits
        </h3>
        <AutoResizeTextarea
          value={personality}
          onChange={setPersonality}
          onBlur={() => patch({ personality })}
          placeholder="Describe your character's personality traits..."
        />
      </Card>

      {/* Ideals */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-2">
          Ideals
        </h3>
        <AutoResizeTextarea
          value={ideals}
          onChange={setIdeals}
          onBlur={() => patch({ ideals })}
          placeholder="What ideals does your character hold?"
        />
      </Card>

      {/* Bonds */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-2">
          Bonds
        </h3>
        <AutoResizeTextarea
          value={bonds}
          onChange={setBonds}
          onBlur={() => patch({ bonds })}
          placeholder="What bonds tie your character to the world?"
        />
      </Card>

      {/* Flaws */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-2">
          Flaws
        </h3>
        <AutoResizeTextarea
          value={flaws}
          onChange={setFlaws}
          onBlur={() => patch({ flaws })}
          placeholder="What flaws or weaknesses does your character have?"
        />
      </Card>

      {/* Backstory */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Backstory
        </h3>
        <AutoResizeTextarea
          value={backstory}
          onChange={setBackstory}
          onBlur={() => patch({ backstory })}
          placeholder="Tell the story of your character's past..."
          minRows={6}
        />
      </Card>

      {/* Appearance */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Appearance
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {APPEARANCE_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-text-secondary font-body mb-1">
                {label}
              </label>
              <input
                type="text"
                value={appearance[key] ?? ""}
                onChange={(e) =>
                  setAppearance((prev) => ({ ...prev, [key]: e.target.value }))
                }
                onBlur={(e) => handleAppearanceBlur(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}…`}
                className="w-full bg-bg-elevated border border-border-subtle rounded px-3 py-1.5 text-sm font-body text-text-primary placeholder:text-text-secondary focus:border-accent/50 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
