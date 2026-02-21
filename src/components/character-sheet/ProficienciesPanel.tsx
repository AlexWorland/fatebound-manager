"use client";

import { useState } from "react";

interface ProficienciesPanelProps {
  armor?: string[];
  weapons?: string[];
  tools?: string[];
  languages?: string[];
}

interface CollapsibleSectionProps {
  label: string;
  items: string[];
}

function CollapsibleSection({ label, items }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 w-full text-left py-1"
      >
        <span className="text-[10px] text-text-secondary transition-transform">
          {isOpen ? "▾" : "▸"}
        </span>
        <span className="text-xs font-condensed font-bold uppercase text-text-secondary tracking-wider">
          {label}
        </span>
      </button>

      {isOpen && (
        <div className="pl-4 pb-1">
          <span className="text-xs text-text-primary">{items.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

export default function ProficienciesPanel({
  armor = [],
  weapons = [],
  tools = [],
  languages = [],
}: ProficienciesPanelProps) {
  return (
    <div className="bg-bg-surface rounded p-3">
      <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-2">
        Proficiencies &amp; Training
      </div>

      <div className="flex flex-col divide-y divide-border-subtle">
        <CollapsibleSection label="Armor" items={armor} />
        <CollapsibleSection label="Weapons" items={weapons} />
        <CollapsibleSection label="Tools" items={tools} />
        <CollapsibleSection label="Languages" items={languages} />
      </div>

      {armor.length === 0 && weapons.length === 0 && tools.length === 0 && languages.length === 0 && (
        <p className="text-xs text-text-muted italic">None listed</p>
      )}
    </div>
  );
}
