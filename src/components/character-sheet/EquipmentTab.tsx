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
  onToggleEquipped,
  onRemove,
}: {
  item: InventoryItem;
  onToggleEquipped: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
      <button
        onClick={onToggleEquipped}
        className={`w-4 h-4 rounded border flex-shrink-0 transition-colors ${
          item.isEquipped
            ? "bg-accent border-accent"
            : "bg-transparent border-border-subtle hover:border-accent"
        }`}
        title={item.isEquipped ? "Unequip" : "Equip"}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-body text-text-highlight truncate">{item.name}</span>
          {item.isMagic && (
            <span className="text-xs text-fate-glow">✦</span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-text-secondary truncate">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 text-xs text-text-secondary font-body">
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
  );
}

const BLANK_ITEM = {
  name: "",
  quantity: 1,
  weight: 0,
  description: "",
  isEquipped: false,
  isMagic: false,
};

export default function EquipmentTab({
  inventory,
  currency,
  onInventoryUpdate,
  onCurrencyUpdate,
}: EquipmentTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState(BLANK_ITEM);

  const totalWeight = inventory.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );

  function toggleEquipped(id: string) {
    onInventoryUpdate(
      inventory.map((item) =>
        item.id === id ? { ...item, isEquipped: !item.isEquipped } : item
      )
    );
  }

  function removeItem(id: string) {
    onInventoryUpdate(inventory.filter((item) => item.id !== id));
  }

  function addItem() {
    if (!newItem.name.trim()) return;
    const item: InventoryItem = {
      ...newItem,
      id: crypto.randomUUID(),
    };
    onInventoryUpdate([...inventory, item]);
    setNewItem(BLANK_ITEM);
    setShowAddForm(false);
  }

  const equipped = inventory.filter((i) => i.isEquipped);
  const unequipped = inventory.filter((i) => !i.isEquipped);

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
            <div className="flex gap-2">
              <div className="flex items-center gap-1 flex-1">
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
              <div className="flex items-center gap-1 flex-1">
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
                  onChange={(e) => setNewItem({ ...newItem, isMagic: e.target.checked })}
                  className="accent-fate"
                />
                Magic
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddForm(false)}
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

        {/* Equipped items */}
        {equipped.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-text-secondary font-body mb-1">Equipped</p>
            {equipped.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggleEquipped={() => toggleEquipped(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Unequipped items */}
        {unequipped.length > 0 && (
          <div>
            {equipped.length > 0 && (
              <p className="text-xs text-text-secondary font-body mb-1">Carried</p>
            )}
            {unequipped.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggleEquipped={() => toggleEquipped(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}

        {inventory.length === 0 && (
          <p className="text-sm font-body text-text-secondary text-center py-4">
            No items in inventory.
          </p>
        )}
      </Card>
    </div>
  );
}
