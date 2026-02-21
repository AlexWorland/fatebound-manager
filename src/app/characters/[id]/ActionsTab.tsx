"use client";

import React, { useState } from "react";
import { Character, DailyState } from "@/types/character";
import { ActionCategory } from "@/types/actions";
import { Card, PipTracker } from "@/components/ui";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { computeAttacks } from "@/engine/attack-calc";
import ActionCategoryFilter from "@/components/character-sheet/ActionCategoryFilter";
import WeaponAttackRow from "@/components/character-sheet/WeaponAttackRow";
import type { ComputedAttack } from "@/types/actions";

interface ActionsTabProps {
  character: Character;
  dailyState: DailyState | null;
  proficiencyBonus: number;
  onOpenAttackRoller?: () => void;
  onDailyStateChange?: (state: DailyState) => void;
}

type ActionType = "Action" | "Bonus Action" | "Reaction";

interface ActionRow {
  name: string;
  actionType: ActionType;
  description: string;
  source: string;
  resourceKey?: string;
}

const ACTION_TYPE_COLORS: Record<ActionType, string> = {
  Action: "bg-accent/20 text-accent border border-accent/40",
  "Bonus Action": "bg-amber-500/20 text-amber-400 border border-amber-500/40",
  Reaction: "bg-builder-blue/20 text-builder-blue border border-builder-blue/40",
};

function ActionTypeChip({ type }: { type: ActionType }) {
  return (
    <span className={`text-[10px] font-condensed font-bold uppercase px-1.5 py-0.5 rounded whitespace-nowrap ${ACTION_TYPE_COLORS[type]}`}>
      {type}
    </span>
  );
}

function ActionRowItem({
  action,
  onRoll,
  dailyState,
  onDailyStateChange,
  characterId,
}: {
  action: ActionRow;
  onRoll?: () => void;
  dailyState?: DailyState | null;
  onDailyStateChange?: (state: DailyState) => void;
  characterId?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const resourceTracker = action.resourceKey && dailyState
    ? dailyState.classResources?.[action.resourceKey]
    : undefined;

  async function handlePipToggle(index: number) {
    if (!dailyState || !action.resourceKey || !resourceTracker || !onDailyStateChange) return;
    const currentUsed = resourceTracker.used;
    const newUsed = index < currentUsed ? index : Math.min(index + 1, resourceTracker.max);
    const newState: DailyState = {
      ...dailyState,
      classResources: {
        ...dailyState.classResources,
        [action.resourceKey]: { ...resourceTracker, used: newUsed },
      },
    };
    onDailyStateChange(newState);
    try {
      await fetch(`/api/characters/${characterId}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classResources: newState.classResources }),
      });
    } catch {
      // Ignore; optimistic update already applied
    }
  }

  return (
    <div className="border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-2 py-2">
        <button
          className="flex items-center gap-2 flex-1 min-w-0 text-left group"
          onClick={() => setExpanded((e) => !e)}
        >
          <span className="text-text-secondary text-xs shrink-0">
            {expanded ? "▾" : "▸"}
          </span>
          <span className="text-sm font-condensed font-bold text-text-primary group-hover:text-text-highlight transition-colors truncate">
            {action.name}
          </span>
          <ActionTypeChip type={action.actionType} />
        </button>
        {resourceTracker && (
          <PipTracker
            label=""
            max={resourceTracker.max}
            used={resourceTracker.used}
            color="bg-accent"
            onToggle={handlePipToggle}
          />
        )}
        {onRoll && (
          <button
            onClick={onRoll}
            className="shrink-0 text-xs font-condensed font-bold px-2 py-1 rounded bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 transition-colors"
          >
            Roll
          </button>
        )}
      </div>
      {expanded && (
        <div className="pb-2 pl-5">
          <p className="text-xs text-text-muted font-condensed uppercase tracking-wider mb-1">
            {action.source}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {action.description}
          </p>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-3">
      {children}
    </h3>
  );
}

function getFormActions(dailyState: DailyState): ActionRow[] {
  const actions: ActionRow[] = [];

  if (dailyState.formType === "CHAOS") {
    if (dailyState.chaosTableB) {
      const primary = TABLE_B_PRIMARY[dailyState.chaosTableB.roll - 1];
      if (primary) {
        const desc = primary.description.toLowerCase();
        const isAttack =
          desc.includes("attack") ||
          desc.includes("strike") ||
          desc.includes("melee") ||
          desc.includes("ranged");
        if (isAttack) {
          actions.push({
            name: primary.name,
            actionType: "Action",
            description: primary.description,
            source: `Table B · ${primary.className}`,
          });
        }
      }
    }

    if (dailyState.chaosTableC) {
      const defensive = TABLE_C_DEFENSIVE[dailyState.chaosTableC.roll - 1];
      if (defensive) {
        const desc = defensive.description.toLowerCase();
        const isReaction = desc.includes("reaction");
        const isBonusAction = desc.includes("bonus action");
        if (isReaction || isBonusAction) {
          actions.push({
            name: defensive.name,
            actionType: isReaction ? "Reaction" : "Bonus Action",
            description: defensive.description,
            source: "Table C",
          });
        }
      }
    }
  } else if (dailyState.formType === "STABILIZED" && dailyState.stabilizedFormId) {
    const form = STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId);
    if (form) {
      for (const bf of form.baseFeatures) {
        const desc = bf.description.toLowerCase();
        const isAttack =
          desc.includes("attack") ||
          desc.includes("strike") ||
          desc.includes("melee") ||
          desc.includes("ranged");
        const isReaction = desc.includes("reaction");
        const isBonusAction = desc.includes("bonus action");

        let actionType: ActionType = "Action";
        if (isReaction) actionType = "Reaction";
        else if (isBonusAction) actionType = "Bonus Action";

        if (isAttack || isReaction || isBonusAction) {
          actions.push({
            name: bf.name,
            actionType,
            description: bf.description,
            source: form.name,
          });
        }
      }
    }
  }

  return actions;
}

// Universal actions every character always has
const UNIVERSAL_ACTIONS: ActionRow[] = [
  {
    name: "Attack",
    actionType: "Action",
    description: "Make a melee or ranged weapon attack. Add your proficiency bonus and relevant ability modifier to the attack roll and damage.",
    source: "Universal",
  },
  {
    name: "Dodge",
    actionType: "Action",
    description: "Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage.",
    source: "Universal",
  },
  {
    name: "Disengage",
    actionType: "Action",
    description: "Your movement doesn't provoke opportunity attacks for the rest of the turn.",
    source: "Universal",
  },
  {
    name: "Help",
    actionType: "Action",
    description: "Lend your aid to another creature in the completion of a task or grant advantage on their next attack roll.",
    source: "Universal",
  },
  {
    name: "Dash",
    actionType: "Action",
    description: "You gain extra movement for the current turn. The increase equals your speed, after applying any modifiers.",
    source: "Universal",
  },
  {
    name: "Hide",
    actionType: "Action",
    description: "Make a Dexterity (Stealth) check in an attempt to hide.",
    source: "Universal",
  },
  {
    name: "Opportunity Attack",
    actionType: "Reaction",
    description: "When a hostile creature that you can see moves out of your reach, you can use your reaction to make one melee attack against it.",
    source: "Universal",
  },
];

function matchesCategory(action: ActionRow, category: ActionCategory): boolean {
  if (category === "ALL") return true;
  if (category === "ATTACK") return action.name.toLowerCase().includes("attack");
  if (category === "ACTION") return action.actionType === "Action";
  if (category === "BONUS_ACTION") return action.actionType === "Bonus Action";
  if (category === "REACTION") return action.actionType === "Reaction";
  if (category === "LIMITED_USE") return !!action.resourceKey;
  if (category === "OTHER") return !["attack", "action", "bonus action", "reaction"].some(k => action.name.toLowerCase().includes(k)) && !action.resourceKey;
  return true;
}

export default function ActionsTab({
  character,
  dailyState,
  proficiencyBonus,
  onOpenAttackRoller,
  onDailyStateChange,
}: ActionsTabProps) {
  const [activeCategory, setActiveCategory] = useState<ActionCategory>("ALL");

  if (!dailyState) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <p className="text-text-secondary text-sm">
            Complete your Dawn Roll to see today's actions.
          </p>
        </Card>
      </div>
    );
  }

  const formActions = getFormActions(dailyState);
  const hasFormActions = formActions.length > 0;

  // Compute weapon attacks
  const attacks = computeAttacks(
    character.equippedWeapons ?? [],
    character.abilityScores,
    proficiencyBonus,
    dailyState?.abilitySwap,
    dailyState?.autoRollResults?.["Fighting Style"]
  );

  const showWeapons = activeCategory === "ALL" || activeCategory === "ATTACK";
  const filteredFormActions = formActions.filter((a) => matchesCategory(a, activeCategory));
  const filteredUniversal = UNIVERSAL_ACTIONS.filter((a) => matchesCategory(a, activeCategory));

  function handleRollAttack(attack: ComputedAttack) {
    // Open attack roller (could be extended to pre-select the weapon)
    onOpenAttackRoller?.();
    void attack; // suppress unused warning
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter */}
      <ActionCategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Attacks per action info */}
      <div className="text-xs text-text-muted font-condensed uppercase tracking-wider">
        Attacks per Action: 1
      </div>

      {/* Weapon attacks table */}
      {showWeapons && (
        <Card>
          <SectionHeader>Weapon Attacks</SectionHeader>
          {attacks.map((attack) => (
            <WeaponAttackRow
              key={attack.weaponId}
              attack={attack}
              proficiencyBonus={proficiencyBonus}
              fightingStyle={dailyState?.autoRollResults?.["Fighting Style"]}
              onRollAttack={handleRollAttack}
            />
          ))}
        </Card>
      )}

      {/* Form-specific actions */}
      {hasFormActions && filteredFormActions.length > 0 && (
        <Card>
          <SectionHeader>
            {dailyState.formType === "CHAOS" ? "Chaos Form Actions" : "Form Actions"}
          </SectionHeader>
          {filteredFormActions.map((action) => (
            <ActionRowItem
              key={action.name}
              action={action}
              onRoll={action.actionType === "Action" && action.name.toLowerCase().includes("attack") ? onOpenAttackRoller : undefined}
              dailyState={dailyState}
              onDailyStateChange={onDailyStateChange}
              characterId={character.id}
            />
          ))}
        </Card>
      )}

      {/* Universal actions */}
      {filteredUniversal.length > 0 && (
        <Card>
          <SectionHeader>Actions in Combat</SectionHeader>
          {filteredUniversal
            .filter((a) => a.actionType === "Action")
            .map((action) => (
              <ActionRowItem
                key={action.name}
                action={action}
                onRoll={action.name === "Attack" ? onOpenAttackRoller : undefined}
              />
            ))}
        </Card>
      )}

      {/* Reactions */}
      {filteredUniversal.filter((a) => a.actionType === "Reaction").length > 0 && (
        <Card>
          <SectionHeader>Reactions</SectionHeader>
          {filteredUniversal
            .filter((a) => a.actionType === "Reaction")
            .map((action) => (
              <ActionRowItem key={action.name} action={action} />
            ))}
        </Card>
      )}
    </div>
  );
}
