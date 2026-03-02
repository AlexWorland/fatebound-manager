"use client";

import { Card } from "@/components/ui";
import {
  EQUIPMENT_PACKS,
  STARTING_WEAPONS,
  STARTING_GOLD,
  type EquipmentPack,
} from "@/data/starting-equipment";

export interface EquipmentData {
  packName: string;
  weapon: string;
  startingGold: number;
}

export function EquipmentStep({
  data,
  onChange,
}: {
  data: EquipmentData;
  onChange: (d: EquipmentData) => void;
}) {
  const selectedPack = EQUIPMENT_PACKS.find((p) => p.name === data.packName) ?? null;

  return (
    <div className="flex flex-col gap-4">
      {/* Pack selection */}
      <Card>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-heading text-text-highlight">Starting Equipment</h2>
            <p className="text-sm text-text-secondary mt-1">
              Choose an equipment pack and a starting weapon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EQUIPMENT_PACKS.map((pack) => (
              <PackCard
                key={pack.name}
                pack={pack}
                isSelected={data.packName === pack.name}
                onSelect={() => onChange({ ...data, packName: pack.name })}
              />
            ))}
          </div>

          {selectedPack && (
            <div className="mt-1 p-3 rounded-lg bg-bg-elevated border border-border-subtle">
              <p className="text-xs text-text-secondary uppercase tracking-widest font-body mb-2">
                Contents
              </p>
              <ul className="flex flex-wrap gap-1">
                {selectedPack.items.map((item) => (
                  <li
                    key={item}
                    className="px-2 py-0.5 rounded text-xs text-text-primary bg-bg-deep border border-border-subtle"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Weapon selection */}
      <Card>
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-base font-heading text-text-highlight">Starting Weapon</h3>
            <p className="text-xs text-text-secondary mt-1">Choose one weapon to start with.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STARTING_WEAPONS.map((weapon) => (
              <button
                key={weapon}
                onClick={() => onChange({ ...data, weapon })}
                className={`px-3 py-2 rounded-lg text-sm font-body text-left transition-colors ${
                  data.weapon === weapon
                    ? "bg-accent/20 border border-accent text-text-highlight"
                    : "bg-bg-elevated border border-border-subtle text-text-primary hover:border-fate/50 hover:bg-bg-hover"
                }`}
              >
                {weapon}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Starting gold */}
      <Card>
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-base font-heading text-text-highlight">Starting Gold</h3>
            <p className="text-xs text-text-secondary mt-1">
              Set your starting gold ({STARTING_GOLD.min}–{STARTING_GOLD.max} gp).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={STARTING_GOLD.min}
              max={STARTING_GOLD.max}
              step={5}
              value={data.startingGold}
              onChange={(e) =>
                onChange({ ...data, startingGold: parseInt(e.target.value, 10) })
              }
              className="flex-1 accent-accent"
            />
            <div className="flex items-center gap-1 min-w-[80px]">
              <input
                type="number"
                min={STARTING_GOLD.min}
                max={STARTING_GOLD.max}
                value={data.startingGold}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) {
                    onChange({
                      ...data,
                      startingGold: Math.max(STARTING_GOLD.min, Math.min(STARTING_GOLD.max, v)),
                    });
                  }
                }}
                className="w-16 text-center px-2 py-1 rounded bg-bg-elevated border border-border-subtle text-text-highlight font-mono text-sm focus:outline-none focus:border-fate"
              />
              <span className="text-sm text-text-secondary font-body">gp</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PackCard({
  pack,
  isSelected,
  onSelect,
}: {
  pack: EquipmentPack;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`text-left p-3 rounded-lg border transition-colors ${
        isSelected
          ? "bg-fate/10 border-fate text-text-highlight"
          : "bg-bg-elevated border-border-subtle text-text-primary hover:border-fate/50 hover:bg-bg-hover"
      }`}
    >
      <div className="font-heading text-sm font-semibold">{pack.name}</div>
      <div className="text-xs text-text-secondary mt-1">{pack.items.length} items</div>
    </button>
  );
}
