import { NextRequest, NextResponse } from "next/server";
import { getCharacterById } from "@/lib/characters";
import { getCurrentDailyState, saveDailyState } from "@/lib/daily-states";
import { saveFormHistory } from "@/lib/form-history";
import {
  resolveDawnRollOutcome,
  dawnRollUsesStabilized,
} from "@/engine/dawn-roll";
import { assembleChaosForm } from "@/engine/chaos-form";
import { resolveStabilizedForm } from "@/engine/stabilized-form";
import { rollD20 } from "@/lib/dice";
import type { DailyState } from "@/types/character";
import type { AbilityScore } from "@/types/forms";

interface DawnRollRequestBody {
  forcedRoll?: number;
  chosenFormId?: number;
  chaosRolls?: {
    tableA?: number;
    tableB?: number;
    tableC?: number;
    tableD?: number[];
  };
  residualMemory?: DailyState["residualMemorySlots"];
  abilitySwap?: { score1: AbilityScore; score2: AbilityScore };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = getCharacterById(id);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as DawnRollRequestBody;

    // Roll the Dawn Roll (or use forced value)
    const die1 = body.forcedRoll ?? rollD20();
    const dawnRollResult = { die1, chosen: die1 };
    const outcome = resolveDawnRollOutcome(die1, character.level);
    const isStabilized = dawnRollUsesStabilized(outcome);

    // Archive current daily state to form_history if one exists
    const existingState = getCurrentDailyState(id);
    if (existingState) {
      saveFormHistory({
        characterId: id,
        date: existingState.date,
        formSummary: {
          formType: existingState.formType,
          dawnRollOutcome: existingState.dawnRollOutcome,
          stabilizedFormId: existingState.stabilizedFormId,
          chaosTableA: existingState.chaosTableA,
          chaosTableB: existingState.chaosTableB,
          chaosTableC: existingState.chaosTableC,
        },
        retainableFeatures: [],
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (isStabilized) {
      // Stabilized form path
      const formId = body.chosenFormId;
      if (!formId) {
        return NextResponse.json(
          {
            error:
              "Stabilized outcome requires chosenFormId in request body",
            outcome,
            dawnRoll: dawnRollResult,
          },
          { status: 400 }
        );
      }

      const resolved = resolveStabilizedForm(formId, character.level);

      const dailyState = saveDailyState({
        characterId: id,
        date: today,
        dawnRoll: dawnRollResult,
        dawnRollOutcome: outcome,
        formType: "STABILIZED",
        stabilizedFormId: formId,
        stabilizedSubclassId: resolved.subclass?.id ?? undefined,
        secondaryFormId: null,
        secondaryFormFeatures: [],
        residualMemorySlots: body.residualMemory ?? [],
        abilitySwap: body.abilitySwap ?? null,
        currentHP: 0,
        tempHP: 0,
        spellSlots: {},
        classResources: {},
        chaosSurgeUsed: false,
        twistOfFateUsed: false,
        defyFateUsed: false,
        fateResistanceSave: null,
      });

      return NextResponse.json({
        dawnRoll: dawnRollResult,
        outcome,
        formType: "STABILIZED",
        resolvedForm: resolved,
        dailyState,
      });
    } else {
      // Chaos form path
      const chaosForm = assembleChaosForm(character.level, body.chaosRolls);

      const dailyState = saveDailyState({
        characterId: id,
        date: today,
        dawnRoll: dawnRollResult,
        dawnRollOutcome: outcome,
        formType: "CHAOS",
        chaosTableA: {
          roll: body.chaosRolls?.tableA ?? 0,
          chassisId: chaosForm.chassis.id,
        },
        chaosTableB: {
          roll: body.chaosRolls?.tableB ?? 0,
          featureId: chaosForm.primaryFeature.id,
        },
        chaosTableC: {
          roll: body.chaosRolls?.tableC ?? 0,
          featureId: chaosForm.defensiveFeature.id,
        },
        chaosTableD: chaosForm.feats.map((f) => ({ roll: 0, featId: f.id })),
        residualMemorySlots: body.residualMemory ?? [],
        abilitySwap: body.abilitySwap ?? null,
        currentHP: 0,
        tempHP: 0,
        spellSlots: {},
        classResources: {},
        chaosSurgeUsed: false,
        twistOfFateUsed: false,
        defyFateUsed: false,
        fateResistanceSave: null,
      });

      return NextResponse.json({
        dawnRoll: dawnRollResult,
        outcome,
        formType: "CHAOS",
        chaosForm,
        dailyState,
      });
    }
  } catch (error) {
    console.error("POST /api/characters/[id]/dawn-roll error:", error);
    return NextResponse.json(
      { error: "Failed to resolve dawn roll" },
      { status: 500 }
    );
  }
}
