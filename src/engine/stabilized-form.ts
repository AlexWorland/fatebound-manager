import type { StabilizedForm, SubclassEntry } from "@/types/forms";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { getSubclassesForForm } from "@/data/subclasses/index";
import { rollFatesSelection } from "@/lib/dice";

export interface ResolvedStabilizedForm {
  form: StabilizedForm;
  subclass: SubclassEntry | null;
  availableFeatures: string[]; // Feature names available at this level
  hasSubclass: boolean;
  hasSignatureAbility: boolean;
  hasCapstone: boolean;
}

/**
 * Get feature names available at a given level for a form.
 * This returns only the base class features — subclass features
 * are composed separately in resolveStabilizedForm.
 */
export function getAvailableFeaturesForLevel(
  form: StabilizedForm,
  _level: number
): string[] {
  return form.baseFeatures.map((f) => f.name);
}

/**
 * Resolve a specific stabilized form at a given level.
 * Handles subclass selection (level 9+) and feature tier scaling.
 *
 * Level tiers:
 * - 5-8:  Base features only
 * - 9-12: Base + subclass level9Feature
 * - 13-16: Base + subclass level9Feature + level13Feature
 * - 17+:  Base + subclass level9Feature + level13Feature + level17Feature
 */
export function resolveStabilizedForm(
  formId: number,
  level: number
): ResolvedStabilizedForm {
  const form = STABILIZED_FORMS.find((f) => f.id === formId);
  if (!form) {
    throw new Error(`No stabilized form found with id ${formId}`);
  }

  const hasSubclass = level >= 9;
  const hasSignatureAbility = level >= 13;
  const hasCapstone = level >= 17;

  const baseFeatureNames = form.baseFeatures.map((f) => f.name);

  let subclass: SubclassEntry | null = null;
  const availableFeatures: string[] = [...baseFeatureNames];

  if (hasSubclass) {
    const subclasses = getSubclassesForForm(formId as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12);
    const roll = rollFatesSelection(subclasses.length);
    subclass = subclasses[roll - 1];

    if (subclass) {
      availableFeatures.push(subclass.level9Feature.name);

      if (hasSignatureAbility) {
        availableFeatures.push(subclass.level13Feature.name);
      }

      if (hasCapstone) {
        availableFeatures.push(subclass.level17Feature.name);
      }
    }
  }

  return {
    form,
    subclass,
    availableFeatures,
    hasSubclass,
    hasSignatureAbility,
    hasCapstone,
  };
}

/**
 * Get secondary form features for Dual Nature (level 11+).
 * Returns base feature names the player can pick from for a given form.
 * The secondary form only grants base features, not subclass tiers.
 *
 * Feature limit (UI selection slots):
 * - Level 17+: 2 features
 * - Below 17:  1 feature
 *
 * When `level` is omitted (for backward compatibility), all base features are returned.
 */
export function getSecondaryFormFeatures(formId: number): string[];
export function getSecondaryFormFeatures(formId: number, level: number): string[];
export function getSecondaryFormFeatures(
  formId: number,
  level?: number
): string[] {
  const form = STABILIZED_FORMS.find((f) => f.id === formId);
  if (!form) {
    throw new Error(`No stabilized form found with id ${formId}`);
  }
  const all = form.baseFeatures.map((f) => f.name);
  if (level === undefined) return all;
  const limit = level >= 17 ? 2 : 1;
  return all.slice(0, limit);
}
