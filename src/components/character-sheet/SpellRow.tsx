"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ResourceTracker } from "@/types/character";

interface SpellRowProps {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  spellSlots: Record<string, ResourceTracker>;
  onCast: (slotLevel: number) => void;
}

const SCHOOL_COLORS: Record<string, string> = {
  abjuration: "text-blue-400",
  conjuration: "text-yellow-400",
  divination: "text-purple-400",
  enchantment: "text-pink-400",
  evocation: "text-red-400",
  illusion: "text-indigo-400",
  necromancy: "text-green-700",
  transmutation: "text-orange-400",
};

export default function SpellRow({
  name,
  level,
  school,
  castingTime,
  range,
  components,
  duration,
  description,
  spellSlots,
  onCast,
}: SpellRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpcastMenu, setShowUpcastMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const schoolColor = SCHOOL_COLORS[school.toLowerCase()] ?? "text-text-secondary";
  const levelLabel = level === 0 ? "Cantrip" : `Level ${level}`;

  // Valid slot levels: numeric keys >= spell level with remaining slots
  const validSlotLevels = Object.entries(spellSlots)
    .filter(([key, tracker]) => {
      const slotLevel = parseInt(key, 10);
      return !isNaN(slotLevel) && slotLevel >= level && tracker.used < tracker.max;
    })
    .map(([key, tracker]) => ({
      slotLevel: parseInt(key, 10),
      remaining: tracker.max - tracker.used,
    }))
    .sort((a, b) => a.slotLevel - b.slotLevel);

  // Cantrips never consume slots
  const isCantrip = level === 0;
  const canCast = isCantrip || validSlotLevels.length > 0;

  // Close upcast menu when clicking outside
  useEffect(() => {
    if (!showUpcastMenu) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUpcastMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUpcastMenu]);

  function handleCastClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isCantrip) {
      // Cantrips don't consume slots — no-op feedback
      return;
    }
    if (validSlotLevels.length === 0) return;
    if (validSlotLevels.length === 1) {
      onCast(validSlotLevels[0].slotLevel);
    } else {
      setShowUpcastMenu((v) => !v);
    }
  }

  function handleSelectSlot(slotLevel: number) {
    setShowUpcastMenu(false);
    onCast(slotLevel);
  }

  return (
    <div className="border border-border-subtle rounded-lg bg-bg-elevated">
      {/* Header row */}
      <button
        className="w-full text-left px-3 py-2.5"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
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
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-body capitalize ${schoolColor}`}>
              {school}
            </span>
            <span className="text-xs font-body text-text-secondary border border-border-subtle rounded px-1.5 py-0.5">
              {levelLabel}
            </span>

            {/* Cast button (leveled spells only) */}
            {!isCantrip && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={handleCastClick}
                  disabled={!canCast}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                    canCast
                      ? "border-accent text-accent hover:bg-accent hover:text-white cursor-pointer"
                      : "border-border-subtle text-text-secondary cursor-not-allowed opacity-50"
                  }`}
                >
                  Cast
                </button>

                {/* Upcast slot picker */}
                {showUpcastMenu && (
                  <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-bg-elevated border border-border-subtle rounded-lg shadow-lg py-1">
                    <p className="text-xs text-text-secondary px-3 py-1.5 border-b border-border-subtle">
                      Choose slot level
                    </p>
                    {validSlotLevels.map(({ slotLevel, remaining }) => (
                      <button
                        key={slotLevel}
                        type="button"
                        onClick={() => handleSelectSlot(slotLevel)}
                        className="w-full text-left px-3 py-1.5 text-sm font-body text-text-primary hover:bg-bg-hover transition-colors"
                      >
                        Level {slotLevel}{" "}
                        <span className="text-xs text-text-secondary">
                          ({remaining} remaining)
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {isOpen && (
        <div className="px-3 pb-3 pt-0 border-t border-border-subtle flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-body text-text-secondary pt-2">
            <span>
              <span className="text-text-primary">Casting Time:</span> {castingTime}
            </span>
            <span>
              <span className="text-text-primary">Range:</span> {range}
            </span>
            <span>
              <span className="text-text-primary">Components:</span> {components}
            </span>
            <span>
              <span className="text-text-primary">Duration:</span> {duration}
            </span>
          </div>
          <p className="text-sm font-body text-text-secondary leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
