"use client";

import React, { useState } from "react";

interface HPBarProps {
  current: number;
  max: number;
  temp: number;
  onUpdate: (current: number, temp: number) => void;
}

export default function HPBar({ current, max, temp, onUpdate }: HPBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<"damage" | "heal" | "temp">("damage");

  const hpPercent = Math.max(0, Math.min(100, (current / max) * 100));
  const tempPercent = Math.max(0, Math.min(100, (temp / max) * 100));

  const barColor =
    hpPercent > 50
      ? "bg-hp-green"
      : hpPercent > 25
      ? "bg-hp-yellow"
      : "bg-hp-red";

  const textColor =
    current === 0
      ? "text-text-secondary"
      : hpPercent > 50
      ? "text-hp-green"
      : hpPercent > 25
      ? "text-hp-yellow"
      : "text-hp-red";

  function applyChange() {
    const amount = parseInt(inputValue, 10);
    if (isNaN(amount) || amount < 0) return;

    if (mode === "damage") {
      let remaining = amount;
      let newTemp = temp;
      if (remaining <= newTemp) {
        newTemp -= remaining;
        remaining = 0;
      } else {
        remaining -= newTemp;
        newTemp = 0;
      }
      const newCurrent = Math.max(0, current - remaining);
      onUpdate(newCurrent, newTemp);
    } else if (mode === "heal") {
      const newCurrent = Math.min(max, current + amount);
      onUpdate(newCurrent, temp);
    } else {
      onUpdate(current, temp + amount);
    }

    setInputValue("");
    setIsEditing(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* HP Numbers */}
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold font-heading ${textColor}`}>{current}</span>
        <span className="text-text-secondary font-body">/ {max}</span>
        {temp > 0 && (
          <span className="text-sm text-blue-400 font-body ml-2">+{temp} temp</span>
        )}
      </div>

      {/* Progress bar */}
      <button
        className="w-full h-4 bg-bg-elevated rounded-full overflow-hidden relative cursor-pointer group"
        onClick={() => setIsEditing(!isEditing)}
        aria-label="Edit HP"
      >
        {/* HP fill */}
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${hpPercent}%` }}
        />
        {/* Temp HP overlay */}
        {temp > 0 && (
          <div
            className="absolute top-0 h-full rounded-full bg-blue-400 opacity-40 transition-all duration-300"
            style={{
              left: `${hpPercent}%`,
              width: `${Math.min(tempPercent, 100 - hpPercent)}%`,
            }}
          />
        )}
        {/* Hover hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-text-secondary">click to edit</span>
        </div>
      </button>

      {/* Edit panel */}
      {isEditing && (
        <div className="flex items-center gap-2 p-2 bg-bg-elevated rounded-lg border border-border-subtle">
          {/* Mode selector */}
          <div className="flex rounded overflow-hidden text-xs font-body">
            {(["damage", "heal", "temp"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2 py-1 capitalize transition-colors ${
                  mode === m
                    ? m === "damage"
                      ? "bg-hp-red text-text-highlight"
                      : m === "heal"
                      ? "bg-hp-green text-text-highlight"
                      : "bg-blue-600 text-text-highlight"
                    : "bg-bg-surface text-text-secondary hover:text-text-primary"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Amount input */}
          <button
            onClick={() => setInputValue((v) => String(Math.max(0, parseInt(v || "0", 10) - 1)))}
            className="w-6 h-6 flex items-center justify-center rounded bg-bg-surface text-text-secondary hover:text-text-primary transition-colors"
          >
            −
          </button>
          <input
            type="number"
            min={0}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyChange()}
            placeholder="0"
            className="w-14 text-center bg-bg-surface border border-border-subtle rounded px-1 py-0.5 text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
          />
          <button
            onClick={() => setInputValue((v) => String(parseInt(v || "0", 10) + 1))}
            className="w-6 h-6 flex items-center justify-center rounded bg-bg-surface text-text-secondary hover:text-text-primary transition-colors"
          >
            +
          </button>

          {/* Apply */}
          <button
            onClick={applyChange}
            className="ml-auto px-3 py-1 rounded bg-accent hover:bg-accent-hover text-text-highlight text-xs font-body transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
