"use client";

import React, { useState } from "react";
import { Character, InventoryItem, Currency, AbilityScores } from "@/types/character";
import { AbilityScore } from "@/types/forms";
import { Card } from "@/components/ui";
import type { CharacterWeapon } from "@/types/equipment";
import { WEAPONS } from "@/data/weapons";

const SKILLS = [
  "Acrobatics", "Animal Handling", "Arcana", "Athletics",
  "Deception", "History", "Insight", "Intimidation",
  "Investigation", "Medicine", "Nature", "Perception",
  "Performance", "Persuasion", "Religion", "Sleight of Hand",
  "Stealth", "Survival",
];

const ABILITY_LABELS: Record<AbilityScore, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

const CURRENCY_LABELS: Record<keyof Currency, string> = {
  cp: "CP",
  sp: "SP",
  ep: "EP",
  gp: "GP",
  pp: "PP",
};

type EditTab = "identity" | "abilities" | "skills" | "notes" | "currency" | "inventory" | "weapons";

const EDIT_TABS: { id: EditTab; label: string }[] = [
  { id: "identity", label: "Identity" },
  { id: "abilities", label: "Abilities" },
  { id: "skills", label: "Skills" },
  { id: "weapons", label: "Weapons" },
  { id: "notes", label: "Notes" },
  { id: "currency", label: "Currency" },
  { id: "inventory", label: "Inventory" },
];

interface Props {
  character: Character;
  onClose: () => void;
  onSave: () => void;
}

export default function CharacterEditModal({ character, onClose, onSave }: Props) {
  const [activeTab, setActiveTab] = useState<EditTab>("identity");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Form state ──────────────────────────────────────────
  const [name, setName] = useState(character.name);
  const [level, setLevel] = useState(character.level);
  const [abilityScores, setAbilityScores] = useState<AbilityScores>({ ...character.abilityScores });
  const [skills, setSkills] = useState<[string, string]>([...character.permanentSkills]);
  const [notes, setNotes] = useState(character.notes);
  const [currency, setCurrency] = useState<Currency>({ ...character.currency });
  const [inventory, setInventory] = useState<InventoryItem[]>(
    character.inventory.map((item) => ({ ...item }))
  );
  const [equippedWeapons, setEquippedWeapons] = useState<CharacterWeapon[]>(
    character.equippedWeapons.map((w) => ({ ...w }))
  );

  // ── Handlers ────────────────────────────────────────────
  function handleAbilityChange(key: AbilityScore, value: string) {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setAbilityScores((prev) => ({ ...prev, [key]: Math.max(1, Math.min(30, num)) }));
    }
  }

  function handleSkillToggle(skill: string) {
    setSkills((prev) => {
      if (prev.includes(skill)) {
        // Remove — replace with empty string, then compact
        const next = prev.map((s) => (s === skill ? "" : s)) as [string, string];
        // Shift non-empty to front
        const filled = next.filter(Boolean);
        return [filled[0] ?? "", filled[1] ?? ""] as [string, string];
      }
      // Add — fill first empty slot
      if (!prev[0]) return [skill, prev[1]] as [string, string];
      if (!prev[1]) return [prev[0], skill] as [string, string];
      return prev; // Both full
    });
  }

  function handleCurrencyChange(key: keyof Currency, value: string) {
    const num = parseInt(value, 10);
    setCurrency((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : Math.max(0, num) }));
  }

  function handleItemChange(index: number, field: keyof InventoryItem, value: string | number | boolean) {
    setInventory((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function handleAddItem() {
    setInventory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        weight: 0,
        description: "",
        isEquipped: false,
        isMagic: false,
      },
    ]);
  }

  function handleRemoveItem(index: number) {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/characters/${character.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          level,
          abilityScores,
          permanentSkills: skills,
          notes,
          currency,
          inventory,
          equippedWeapons,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 pb-4 sm:pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg-surface border border-border-subtle rounded-xl w-full max-w-2xl mx-4 shadow-floating">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-xl font-heading text-text-highlight">Edit Character</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 px-6 pt-4 overflow-x-auto">
          {EDIT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-condensed font-bold uppercase tracking-wider rounded-t transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-bg-elevated text-text-highlight border-b-2 border-accent"
                  : "text-text-secondary hover:text-text-highlight"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-6 py-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
          {activeTab === "identity" && (
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-condensed uppercase tracking-wider text-text-secondary mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg-input border border-border-input rounded px-3 py-2 text-text-primary font-body focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-condensed uppercase tracking-wider text-text-secondary mb-1">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                    className="w-full bg-bg-input border border-border-input rounded px-3 py-2 text-text-primary font-body focus:outline-none focus:border-accent"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((l) => (
                      <option key={l} value={l}>
                        Level {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "abilities" && (
            <Card>
              <div className="grid grid-cols-2 gap-4">
                {(Object.entries(ABILITY_LABELS) as [AbilityScore, string][]).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-condensed uppercase tracking-wider text-text-secondary mb-1">
                      {label} ({key})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={abilityScores[key]}
                      onChange={(e) => handleAbilityChange(key, e.target.value)}
                      className="w-full bg-bg-input border border-border-input rounded px-3 py-2 text-text-primary font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "skills" && (
            <Card>
              <p className="text-xs font-condensed uppercase tracking-wider text-text-secondary mb-3">
                Select exactly 2 skill proficiencies.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SKILLS.map((skill) => {
                  const isSelected = skills.includes(skill);
                  const isFull = skills[0] !== "" && skills[1] !== "";
                  const isDisabled = !isSelected && isFull;

                  return (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      disabled={isDisabled}
                      className={`px-3 py-2 rounded text-xs font-condensed font-bold uppercase tracking-wider text-left transition-colors ${
                        isSelected
                          ? "bg-accent/20 border border-accent text-text-highlight"
                          : isDisabled
                          ? "bg-bg-elevated border border-border-subtle text-text-secondary opacity-50 cursor-not-allowed"
                          : "bg-bg-elevated border border-border-subtle text-text-primary hover:border-accent hover:text-text-highlight cursor-pointer"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === "notes" && (
            <Card>
              <label className="block text-xs font-condensed uppercase tracking-wider text-text-secondary mb-1">Character Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={10}
                className="w-full bg-bg-input border border-border-input rounded px-3 py-2 text-text-primary font-body focus:outline-none focus:border-accent resize-y"
              />
            </Card>
          )}

          {activeTab === "currency" && (
            <Card>
              <div className="grid grid-cols-5 gap-3">
                {(Object.entries(CURRENCY_LABELS) as [keyof Currency, string][]).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-body text-text-secondary mb-1 text-center">
                      {label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={currency[key]}
                      onChange={(e) => handleCurrencyChange(key, e.target.value)}
                      className="w-full bg-bg-input border border-border-input rounded px-2 py-2 text-text-primary font-mono text-center focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-3">
              {inventory.map((item, index) => (
                <Card key={item.id}>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        placeholder="Item name"
                        className="flex-1 bg-bg-input border border-border-input rounded px-3 py-1.5 text-sm text-text-primary font-body focus:outline-none focus:border-accent"
                      />
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value, 10) || 1)}
                        className="w-16 bg-bg-input border border-border-input rounded px-2 py-1.5 text-sm text-text-primary font-mono text-center focus:outline-none focus:border-accent"
                        title="Quantity"
                      />
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={item.weight}
                        onChange={(e) => handleItemChange(index, "weight", parseFloat(e.target.value) || 0)}
                        className="w-20 bg-bg-input border border-border-input rounded px-2 py-1.5 text-sm text-text-primary font-mono text-center focus:outline-none focus:border-accent"
                        title="Weight (lbs)"
                      />
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-hp-red hover:text-accent transition-colors px-2 text-lg"
                        aria-label="Remove item"
                      >
                        &times;
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full bg-bg-input border border-border-input rounded px-3 py-1.5 text-sm text-text-primary font-body focus:outline-none focus:border-accent"
                    />
                    <div className="flex gap-4 text-xs font-body">
                      <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isEquipped}
                          onChange={(e) => handleItemChange(index, "isEquipped", e.target.checked)}
                          className="accent-accent"
                        />
                        Equipped
                      </label>
                      <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isMagic}
                          onChange={(e) => handleItemChange(index, "isMagic", e.target.checked)}
                          className="accent-fate"
                        />
                        Magic
                      </label>
                    </div>
                  </div>
                </Card>
              ))}
              <button
                onClick={handleAddItem}
                className="w-full py-2 border border-dashed border-border-subtle rounded text-xs font-condensed font-bold uppercase tracking-wider text-text-secondary hover:border-accent hover:text-text-highlight transition-colors"
              >
                + Add Item
              </button>
            </div>
          )}

          {activeTab === "weapons" && (
            <div className="space-y-3">
              {equippedWeapons.map((cw, index) => (
                <Card key={cw.id}>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={cw.weaponName}
                        onChange={(e) => {
                          const next = [...equippedWeapons];
                          next[index] = { ...next[index], weaponName: e.target.value };
                          setEquippedWeapons(next);
                        }}
                        className="flex-1 bg-bg-input border border-border-input rounded px-3 py-1.5 text-sm text-text-primary font-body focus:outline-none focus:border-accent"
                      >
                        <optgroup label="Simple Melee">
                          {WEAPONS.filter(w => w.category === "simple" && w.range === "melee").map(w => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Simple Ranged">
                          {WEAPONS.filter(w => w.category === "simple" && w.range === "ranged").map(w => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Martial Melee">
                          {WEAPONS.filter(w => w.category === "martial" && w.range === "melee").map(w => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Martial Ranged">
                          {WEAPONS.filter(w => w.category === "martial" && w.range === "ranged").map(w => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </optgroup>
                      </select>
                      <button
                        onClick={() => setEquippedWeapons(prev => prev.filter((_, i) => i !== index))}
                        className="text-hp-red hover:text-accent transition-colors px-2 text-lg"
                        aria-label="Remove weapon"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cw.customName || ""}
                        onChange={(e) => {
                          const next = [...equippedWeapons];
                          next[index] = { ...next[index], customName: e.target.value || undefined };
                          setEquippedWeapons(next);
                        }}
                        placeholder="Custom name (optional)"
                        className="flex-1 bg-bg-input border border-border-input rounded px-3 py-1.5 text-sm text-text-primary font-body focus:outline-none focus:border-accent"
                      />
                      <input
                        type="number"
                        min={0}
                        max={3}
                        value={cw.magicBonus}
                        onChange={(e) => {
                          const next = [...equippedWeapons];
                          next[index] = { ...next[index], magicBonus: parseInt(e.target.value, 10) || 0 };
                          setEquippedWeapons(next);
                        }}
                        className="w-16 bg-bg-input border border-border-input rounded px-2 py-1.5 text-sm text-text-primary font-mono text-center focus:outline-none focus:border-accent"
                        title="Magic bonus (+1, +2, +3)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cw.bonusDamage || ""}
                        onChange={(e) => {
                          const next = [...equippedWeapons];
                          next[index] = { ...next[index], bonusDamage: e.target.value || undefined };
                          setEquippedWeapons(next);
                        }}
                        placeholder="Bonus damage (e.g. 1d6)"
                        className="flex-1 bg-bg-input border border-border-input rounded px-3 py-1.5 text-sm text-text-primary font-body focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        value={cw.bonusDamageType || ""}
                        onChange={(e) => {
                          const next = [...equippedWeapons];
                          next[index] = { ...next[index], bonusDamageType: e.target.value || undefined };
                          setEquippedWeapons(next);
                        }}
                        placeholder="Type (e.g. fire)"
                        className="w-28 bg-bg-input border border-border-input rounded px-3 py-1.5 text-sm text-text-primary font-body focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex gap-4 text-xs font-body">
                      <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cw.isEquipped}
                          onChange={(e) => {
                            const next = [...equippedWeapons];
                            next[index] = { ...next[index], isEquipped: e.target.checked };
                            setEquippedWeapons(next);
                          }}
                          className="accent-accent"
                        />
                        Equipped
                      </label>
                    </div>
                    <input
                      type="text"
                      value={cw.notes || ""}
                      onChange={(e) => {
                        const next = [...equippedWeapons];
                        next[index] = { ...next[index], notes: e.target.value || undefined };
                        setEquippedWeapons(next);
                      }}
                      placeholder="Notes (optional)"
                      className="w-full bg-bg-input border border-border-input rounded px-3 py-1.5 text-sm text-text-primary font-body focus:outline-none focus:border-accent"
                    />
                  </div>
                </Card>
              ))}
              <button
                onClick={() => setEquippedWeapons(prev => [...prev, {
                  id: crypto.randomUUID(),
                  weaponName: "Longsword",
                  magicBonus: 0,
                  isEquipped: true,
                }])}
                className="w-full py-2 border border-dashed border-border-subtle rounded text-xs font-condensed font-bold uppercase tracking-wider text-text-secondary hover:border-accent hover:text-text-highlight transition-colors"
              >
                + Add Weapon
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle">
          <div>
            {error && <p className="text-sm text-hp-red font-body">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-condensed font-bold uppercase tracking-wider border border-border-subtle text-text-secondary hover:text-text-highlight transition-colors rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 text-xs font-condensed font-bold uppercase tracking-wider bg-accent text-white rounded hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
