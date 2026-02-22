"use client";

import React, { useState } from "react";
import { Character, InventoryItem, Currency } from "@/types/character";
import { Card } from "@/components/ui";

interface Props {
  character: Character;
}

const COIN_LABELS: { key: keyof Currency; label: string; color: string }[] = [
  { key: "pp", label: "PP", color: "text-fate-glow" },
  { key: "gp", label: "GP", color: "text-hp-yellow" },
  { key: "ep", label: "EP", color: "text-text-secondary" },
  { key: "sp", label: "SP", color: "text-text-secondary" },
  { key: "cp", label: "CP", color: "text-text-secondary" },
];

const RARITY_COLORS: Record<string, string> = {
  common: "text-gray-400 border-gray-600",
  uncommon: "text-green-400 border-green-600",
  rare: "text-blue-400 border-blue-600",
  very_rare: "text-purple-400 border-purple-600",
  legendary: "text-orange-400 border-orange-600",
  artifact: "text-red-400 border-red-600",
};

function getEffectiveLocation(item: InventoryItem): "equipped" | "carried" | "stored" {
  if (item.location) return item.location;
  return item.isEquipped ? "equipped" : "carried";
}

function CurrencyDisplay({ currency }: { currency: Currency }) {
  return (
    <div className="flex flex-wrap gap-4">
      {COIN_LABELS.map(({ key, label, color }) => (
        <div key={key} className="flex flex-col items-center">
          <span className={`text-lg font-mono font-bold ${color}`}>
            {currency[key]}
          </span>
          <span className="text-xs text-text-secondary font-body">{label}</span>
        </div>
      ))}
    </div>
  );
}

function ItemRow({ item }: { item: InventoryItem }) {
  const [open, setOpen] = useState(false);
  const location = getEffectiveLocation(item);

  return (
    <div className="border-b border-border-subtle last:border-0">
      <button
        className="w-full flex items-center gap-3 py-2 text-left group"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Location indicator */}
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${
            location === "equipped"
              ? "bg-hp-green"
              : location === "stored"
              ? "bg-border-subtle opacity-50"
              : "bg-border-subtle"
          }`}
          title={location.charAt(0).toUpperCase() + location.slice(1)}
        />
        <span className="flex-1 text-sm font-body text-text-primary group-hover:text-text-highlight transition-colors">
          {item.name}
          {item.isMagic && (
            <span className="ml-1.5 text-xs text-fate-glow">✦</span>
          )}
        </span>
        {item.isMagic && item.rarity && (
          <span className={`text-xs px-1.5 py-0.5 rounded border shrink-0 ${RARITY_COLORS[item.rarity] || ""}`}>
            {item.rarity.replace("_", " ")}
          </span>
        )}
        <span className="text-xs text-text-secondary font-mono shrink-0">
          ×{item.quantity}
        </span>
        {item.weight > 0 && (
          <span className="text-xs text-text-secondary font-mono shrink-0">
            {item.weight * item.quantity} lb
          </span>
        )}
        <span className="text-xs text-text-secondary">{open ? "▲" : "▼"}</span>
      </button>

      {open && item.description && (
        <p className="pb-3 pl-5 text-xs font-body text-text-secondary leading-relaxed">
          {item.description}
        </p>
      )}
    </div>
  );
}

export default function EquipmentTab({ character }: Props) {
  const equippedItems = character.inventory.filter((i) => getEffectiveLocation(i) === "equipped");
  const carriedItems = character.inventory.filter((i) => getEffectiveLocation(i) === "carried");
  const storedItems = character.inventory.filter((i) => getEffectiveLocation(i) === "stored");
  const totalWeight = character.inventory.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Currency */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Currency
        </h3>
        <CurrencyDisplay currency={character.currency} />
      </Card>

      {/* Equipped items */}
      {equippedItems.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest">
              Equipped
            </h3>
            <span className="text-xs text-text-secondary font-mono">
              {equippedItems.length} items
            </span>
          </div>
          <div>
            {equippedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </Card>
      )}

      {/* Carried items */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest">
            Inventory
          </h3>
          <span className="text-xs text-text-secondary font-mono">
            {totalWeight} lb total
          </span>
        </div>
        {character.inventory.length === 0 ? (
          <p className="text-sm text-text-secondary font-body">No items.</p>
        ) : (
          <div>
            {carriedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
            {carriedItems.length === 0 && equippedItems.length > 0 && (
              <p className="text-sm text-text-secondary font-body">
                All items are equipped.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Stored items */}
      {storedItems.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest">
              Stored
            </h3>
            <span className="text-xs text-text-secondary font-mono">
              {storedItems.length} items
            </span>
          </div>
          <div>
            {storedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
