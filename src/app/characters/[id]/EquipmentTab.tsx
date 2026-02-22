"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui";
import type { InventoryItem, Currency } from "@/types/character";

interface EquipmentTabProps {
  inventory: InventoryItem[];
  currency: Currency;
  onInventoryUpdate: (inventory: InventoryItem[]) => void;
  onCurrencyUpdate: (currency: Currency) => void;
}

const CURRENCY_LABELS: { key: keyof Currency; label: string; color: string }[] = [
  { key: "pp", label: "PP", color: "text-purple-400" },
  { key: "gp", label: "GP", color: "text-yellow-400" },
  { key: "ep", label: "EP", color: "text-blue-300" },
  { key: "sp", label: "SP", color: "text-gray-300" },
  { key: "cp", label: "CP", color: "text-orange-400" },
];

const RARITY_COLORS: Record<string, string> = {
  common: "text-gray-400 border-gray-600",
  uncommon: "text-green-400 border-green-600",
  rare: "text-blue-400 border-blue-600",
  very_rare: "text-purple-400 border-purple-600",
  legendary: "text-orange-400 border-orange-600",
  artifact: "text-red-400 border-red-600",
};

const FILTERS = ["All", "Equipped", "Carried", "Stored", "Attunement"] as const;
type Filter = (typeof FILTERS)[number];

function getEffectiveLocation(item: InventoryItem): "equipped" | "carried" | "stored" {
  if (item.location) return item.location;
  return item.isEquipped ? "equipped" : "carried";
}

function CurrencyTracker({
  currency,
  onUpdate,
}: {
  currency: Currency;
  onUpdate: (currency: Currency) => void;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-bg-surface border border-border-subtle rounded-lg">
      <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest">
        Currency
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {CURRENCY_LABELS.map(({ key, label, color }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className={`text-xs font-body font-semibold ${color}`}>{label}</span>
            <input
              type="number"
              min={0}
              value={currency[key]}
              onChange={(e) =>
                onUpdate({ ...currency, [key]: Math.max(0, parseInt(e.target.value) || 0) })
              }
              className="w-full text-center bg-bg-elevated border border-border-subtle rounded px-1 py-1 text-text-highlight font-mono text-sm focus:outline-none focus:border-accent"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemRow({
  item,
  onLocationChange,
  onRemove,
}: {
  item: InventoryItem;
  onLocationChange: (location: "equipped" | "carried" | "stored") => void;
  onRemove: () => void;
}) {
  const effectiveLocation = getEffectiveLocation(item);

  return (
    <div className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-body text-text-highlight truncate">{item.name}</span>
          {item.isMagic && (
            <span className="text-xs text-fate-glow">✦</span>
          )}
          {item.isMagic && item.rarity && (
            <span className={`text-xs px-1.5 py-0.5 rounded border ${RARITY_COLORS[item.rarity] || ""}`}>
              {item.rarity.replace("_", " ")}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-text-secondary truncate">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 3-state location selector */}
        <div className="flex rounded border border-border-subtle overflow-hidden text-xs font-body">
          {(["equipped", "carried", "stored"] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => onLocationChange(loc)}
              className={`px-1.5 py-0.5 capitalize transition-colors ${
                effectiveLocation === loc
                  ? "bg-accent text-text-highlight"
                  : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
              title={loc.charAt(0).toUpperCase() + loc.slice(1)}
            >
              {loc.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-text-secondary font-body">
          <span>×{item.quantity}</span>
          <span>{item.weight} lb</span>
          <button
            onClick={onRemove}
            className="text-text-secondary hover:text-accent transition-colors"
            title="Remove item"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

const BLANK_ITEM = {
  name: "",
  quantity: 1,
  weight: 0,
  description: "",
  isEquipped: false,
  isMagic: false,
  rarity: "" as InventoryItem["rarity"] | "",
  location: "carried" as InventoryItem["location"],
};

export default function EquipmentTab({
  inventory,
  currency,
  onInventoryUpdate,
  onCurrencyUpdate,
}: EquipmentTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState(BLANK_ITEM);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const totalWeight = inventory.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  function updateLocation(id: string, location: "equipped" | "carried" | "stored") {
    onInventoryUpdate(
      inventory.map((item) =>
        item.id === id
          ? { ...item, location, isEquipped: location === "equipped" }
          : item
      )
    );
  }

  function removeItem(id: string) {
    onInventoryUpdate(inventory.filter((item) => item.id !== id));
  }

  function addItem() {
    if (!newItem.name.trim()) return;
    const item: InventoryItem = {
      id: crypto.randomUUID(),
      name: newItem.name,
      quantity: newItem.quantity,
      weight: newItem.weight,
      description: newItem.description,
      isEquipped: newItem.location === "equipped",
      isMagic: newItem.isMagic,
      location: newItem.location || "carried",
      ...(newItem.isMagic && newItem.rarity ? { rarity: newItem.rarity as InventoryItem["rarity"] } : {}),
    };
    onInventoryUpdate([...inventory, item]);
    setNewItem(BLANK_ITEM);
    setShowAddForm(false);
  }

  const filteredInventory = inventory.filter((item) => {
    const loc = getEffectiveLocation(item);
    switch (activeFilter) {
      case "Equipped":
        return loc === "equipped";
      case "Carried":
        return loc === "carried";
      case "Stored":
        return loc === "stored";
      case "Attunement":
        return loc === "equipped" && item.isMagic;
      default:
        return true;
    }
  });

  const equipped = inventory.filter((i) => getEffectiveLocation(i) === "equipped");
  const carried = inventory.filter((i) => getEffectiveLocation(i) === "carried");
  const stored = inventory.filter((i) => getEffectiveLocation(i) === "stored");

  return (
    <div className="flex flex-col gap-4">
      {/* Currency */}
      <CurrencyTracker currency={currency} onUpdate={onCurrencyUpdate} />

      {/* Weight */}
      <div className="text-xs font-body text-text-secondary text-right">
        Total weight: <span className="text-text-highlight">{totalWeight} lb</span>
      </div>

      {/* Inventory */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest">
            Inventory ({inventory.length})
          </h3>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="text-xs font-body px-3 py-1 rounded bg-accent hover:bg-accent-hover text-text-highlight transition-colors"
          >
            + Add Item
          </button>
        </div>

        {/* Add item form */}
        {showAddForm && (
          <div className="flex flex-col gap-2 mb-4 p-3 bg-bg-elevated rounded-lg border border-border-subtle">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-primary text-sm font-body focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-primary text-sm font-body focus:outline-none focus:border-accent"
            />
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1 flex-1 min-w-[80px]">
                <label className="text-xs text-text-secondary font-body">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                  className="w-16 bg-bg-surface border border-border-subtle rounded px-2 py-1 text-text-primary text-sm font-mono focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex items-center gap-1 flex-1 min-w-[100px]">
                <label className="text-xs text-text-secondary font-body">Weight</label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={newItem.weight}
                  onChange={(e) =>
                    setNewItem({ ...newItem, weight: parseFloat(e.target.value) || 0 })
                  }
                  className="w-16 bg-bg-surface border border-border-subtle rounded px-2 py-1 text-text-primary text-sm font-mono focus:outline-none focus:border-accent"
                />
              </div>
              <label className="flex items-center gap-1 text-xs text-text-secondary font-body cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItem.isMagic}
                  onChange={(e) => setNewItem({ ...newItem, isMagic: e.target.checked, rarity: "" })}
                  className="accent-fate"
                />
                Magic
              </label>
            </div>
            {/* Rarity dropdown — only shown for magic items */}
            {newItem.isMagic && (
              <select
                value={newItem.rarity || ""}
                onChange={(e) => setNewItem({ ...newItem, rarity: e.target.value as InventoryItem["rarity"] | "" })}
                className="bg-bg-surface border border-border-subtle rounded px-2 py-1.5 text-text-primary text-sm font-body focus:outline-none focus:border-accent"
              >
                <option value="">No rarity</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="very_rare">Very Rare</option>
                <option value="legendary">Legendary</option>
                <option value="artifact">Artifact</option>
              </select>
            )}
            {/* Location selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-text-secondary font-body">Location</label>
              <div className="flex rounded border border-border-subtle overflow-hidden text-xs font-body">
                {(["equipped", "carried", "stored"] as const).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setNewItem({ ...newItem, location: loc })}
                    className={`px-2 py-1 capitalize transition-colors ${
                      (newItem.location || "carried") === loc
                        ? "bg-accent text-text-highlight"
                        : "bg-transparent text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowAddForm(false); setNewItem(BLANK_ITEM); }}
                className="text-xs font-body px-3 py-1 rounded border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="text-xs font-body px-3 py-1 rounded bg-accent hover:bg-accent-hover text-text-highlight transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {FILTERS.map((filter) => {
            const count =
              filter === "All" ? inventory.length
              : filter === "Equipped" ? equipped.length
              : filter === "Carried" ? carried.length
              : filter === "Stored" ? stored.length
              : inventory.filter((i) => getEffectiveLocation(i) === "equipped" && i.isMagic).length;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-xs font-body px-2.5 py-1 rounded-full border transition-colors ${
                  activeFilter === filter
                    ? "bg-accent border-accent text-text-highlight"
                    : "bg-transparent border-border-subtle text-text-secondary hover:border-accent hover:text-text-primary"
                }`}
              >
                {filter}
                {count > 0 && (
                  <span className="ml-1 opacity-70">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filtered items */}
        {filteredInventory.length === 0 ? (
          <p className="text-sm font-body text-text-secondary text-center py-4">
            {inventory.length === 0 ? "No items in inventory." : "No items match this filter."}
          </p>
        ) : (
          filteredInventory.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onLocationChange={(location) => updateLocation(item.id, location)}
              onRemove={() => removeItem(item.id)}
            />
          ))
        )}
      </Card>
    </div>
  );
}
