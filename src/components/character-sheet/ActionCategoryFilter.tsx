"use client";

import React from "react";
import type { ActionCategory } from "@/types/actions";

interface ActionCategoryFilterProps {
  activeCategory: ActionCategory;
  onCategoryChange: (cat: ActionCategory) => void;
}

const CATEGORIES: { id: ActionCategory; label: string }[] = [
  { id: "ALL", label: "ALL" },
  { id: "ATTACK", label: "ATTACK" },
  { id: "ACTION", label: "ACTION" },
  { id: "BONUS_ACTION", label: "BONUS ACTION" },
  { id: "REACTION", label: "REACTION" },
  { id: "LIMITED_USE", label: "LIMITED USE" },
  { id: "OTHER", label: "OTHER" },
];

export default function ActionCategoryFilter({
  activeCategory,
  onCategoryChange,
}: ActionCategoryFilterProps) {
  return (
    <div className="flex gap-1 items-center flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={
            activeCategory === cat.id
              ? "bg-accent text-white rounded px-2 py-0.5 text-xs font-bold"
              : "text-text-secondary hover:text-text-primary px-2 py-0.5 text-xs font-bold transition-colors"
          }
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
