"use client";

import React from "react";
import { Card } from "@/components/ui";
import type { ArmorProficiency, WeaponProficiency } from "@/types/forms";

interface ProficienciesPanelProps {
  formArmorProficiencies?: ArmorProficiency[];
  formWeaponProficiencies?: WeaponProficiency[];
  tools?: string[];
  languages?: string[];
}

// Base Fatebound proficiencies
const BASE_ARMOR_PROFICIENCIES: ArmorProficiency[] = ["light"];
const BASE_WEAPON_PROFICIENCIES: WeaponProficiency[] = ["simple", "martial"];

function ProficiencyBadge({
  proficiency,
  isFormSpecific = false,
}: {
  proficiency: string;
  isFormSpecific?: boolean;
}) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs rounded border transition-colors ${
        isFormSpecific
          ? "bg-bg-surface border-border-subtle text-fate-glow"
          : "bg-bg-elevated border-border-subtle text-text-primary"
      }`}
      title={isFormSpecific ? "From Form" : undefined}
    >
      {proficiency}
    </span>
  );
}

function ProficiencySection({
  title,
  items,
  emptyText = "None",
}: {
  title: string;
  items: Array<{ text: string; isFormSpecific: boolean }>;
  emptyText?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-body text-text-secondary uppercase tracking-widest">
        {title}
      </h4>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <ProficiencyBadge
              key={idx}
              proficiency={item.text}
              isFormSpecific={item.isFormSpecific}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">{emptyText}</p>
      )}
    </div>
  );
}

export default function ProficienciesPanel({
  formArmorProficiencies = [],
  formWeaponProficiencies = [],
  tools = [],
  languages = [],
}: ProficienciesPanelProps) {
  // Combine base and form-specific armor proficiencies
  const armorItems = [
    ...BASE_ARMOR_PROFICIENCIES.map((p) => ({ text: p, isFormSpecific: false })),
    ...formArmorProficiencies.map((p) => ({ text: p, isFormSpecific: true })),
  ];

  // Combine base and form-specific weapon proficiencies
  const weaponItems = [
    ...BASE_WEAPON_PROFICIENCIES.map((p) => ({ text: p, isFormSpecific: false })),
    ...formWeaponProficiencies.map((p) => ({ text: p, isFormSpecific: true })),
  ];

  // Tool proficiencies
  const toolItems = tools.map((t) => ({ text: t, isFormSpecific: false }));

  // Language proficiencies (default to Common if empty)
  const languageItems =
    languages.length > 0
      ? languages.map((l) => ({ text: l, isFormSpecific: false }))
      : [{ text: "Common", isFormSpecific: false }];

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <ProficiencySection title="Armor Proficiencies" items={armorItems} />
        <div className="border-t border-border-subtle" />
        <ProficiencySection title="Weapon Proficiencies" items={weaponItems} />
        <div className="border-t border-border-subtle" />
        <ProficiencySection title="Tools" items={toolItems} emptyText="None" />
        <div className="border-t border-border-subtle" />
        <ProficiencySection title="Languages" items={languageItems} />
      </div>
    </Card>
  );
}
