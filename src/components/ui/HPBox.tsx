"use client";

import { useState } from "react";

interface HPBoxProps {
  current: number;
  max: number;
  temp: number;
  onUpdate: (current: number, temp: number) => void;
}

type HPMode = null | "heal" | "damage" | "temp";

export default function HPBox({ current, max, temp, onUpdate }: HPBoxProps) {
  const [mode, setMode] = useState<HPMode>(null);
  const [inputValue, setInputValue] = useState("");

  function applyMode() {
    const amount = parseInt(inputValue, 10);
    if (isNaN(amount) || amount <= 0) {
      setMode(null);
      setInputValue("");
      return;
    }

    if (mode === "heal") {
      const newCurrent = Math.min(current + amount, max);
      onUpdate(newCurrent, temp);
    } else if (mode === "damage") {
      let remaining = amount;
      let newTemp = temp;
      if (newTemp > 0) {
        const tempAbsorbed = Math.min(newTemp, remaining);
        newTemp -= tempAbsorbed;
        remaining -= tempAbsorbed;
      }
      const newCurrent = Math.max(current - remaining, 0);
      onUpdate(newCurrent, newTemp);
    } else if (mode === "temp") {
      onUpdate(current, amount);
    }

    setMode(null);
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") applyMode();
    if (e.key === "Escape") {
      setMode(null);
      setInputValue("");
    }
  }

  function selectMode(selected: HPMode) {
    if (mode === selected) {
      setMode(null);
      setInputValue("");
    } else {
      setMode(selected);
      setInputValue("");
    }
  }

  return (
    <div className="border border-border-subtle rounded p-2 bg-bg-surface">
      <div className="flex items-stretch gap-2">
        {/* Left: HEAL / DAMAGE buttons */}
        <div className="flex flex-col gap-1 justify-center">
          <button
            onClick={() => selectMode("heal")}
            className={`px-2 py-1 text-[10px] font-condensed font-bold uppercase rounded tracking-wider transition-colors ${
              mode === "heal"
                ? "bg-hp-green text-white"
                : "bg-hp-green/20 text-hp-green hover:bg-hp-green/40"
            }`}
          >
            Heal
          </button>
          <button
            onClick={() => selectMode("damage")}
            className={`px-2 py-1 text-[10px] font-condensed font-bold uppercase rounded tracking-wider transition-colors ${
              mode === "damage"
                ? "bg-hp-red text-white"
                : "bg-hp-red/20 text-hp-red hover:bg-hp-red/40"
            }`}
          >
            Dmg
          </button>
        </div>

        {/* Center: Current / Max */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-2xl font-bold text-text-highlight leading-none">
            {current}
          </div>
          <div className="border-t border-border-subtle w-full my-1" />
          <div className="text-xs font-bold text-text-secondary leading-none">
            {max}
          </div>
        </div>

        {/* Right: Temp HP */}
        <div className="flex flex-col items-center justify-center min-w-[48px]">
          <div
            className={`text-lg font-bold leading-none cursor-pointer ${
              mode === "temp" ? "text-fate" : "text-text-secondary hover:text-text-primary"
            }`}
            onClick={() => selectMode("temp")}
          >
            {temp}
          </div>
          <div className="text-[8px] font-condensed font-bold uppercase text-text-muted tracking-wider mt-1">
            Temp
          </div>
        </div>
      </div>

      {/* Input row — shown when a mode is active */}
      {mode && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={applyMode}
            autoFocus
            placeholder={
              mode === "heal" ? "Heal amount" : mode === "damage" ? "Damage amount" : "Temp HP"
            }
            className="flex-1 bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          <button
            onClick={applyMode}
            className="text-[10px] font-condensed font-bold uppercase text-accent hover:text-text-primary transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Label */}
      <div className="mt-1.5 text-center text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider">
        Hit Points
      </div>
    </div>
  );
}
