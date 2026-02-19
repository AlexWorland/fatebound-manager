import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  resolveStabilizedForm,
  getAvailableFeaturesForLevel,
  getSecondaryFormFeatures,
} from "../stabilized-form";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";

// Mock dice so subclass rolls are deterministic
vi.mock("@/lib/dice", () => ({
  rollFatesSelection: vi.fn().mockReturnValue(1),
}));

describe("getAvailableFeaturesForLevel", () => {
  const tempest = STABILIZED_FORMS.find((f) => f.id === 1)!;

  it("level 5-8: returns only base feature names", () => {
    const features = getAvailableFeaturesForLevel(tempest, 5);
    expect(features).toEqual(tempest.baseFeatures.map((f) => f.name));
    expect(features.length).toBeGreaterThan(0);
  });

  it("level 8 (boundary): still only base features", () => {
    const features = getAvailableFeaturesForLevel(tempest, 8);
    expect(features).toEqual(tempest.baseFeatures.map((f) => f.name));
  });

  it("level 9: includes base features (subclass features are tracked separately)", () => {
    const features = getAvailableFeaturesForLevel(tempest, 9);
    expect(features).toEqual(tempest.baseFeatures.map((f) => f.name));
  });
});

describe("resolveStabilizedForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("level 5: base features only, no subclass", () => {
    const result = resolveStabilizedForm(1, 5);
    expect(result.hasSubclass).toBe(false);
    expect(result.subclass).toBeNull();
    expect(result.hasSignatureAbility).toBe(false);
    expect(result.hasCapstone).toBe(false);
    expect(result.form.id).toBe(1);
    expect(result.availableFeatures).toEqual(
      result.form.baseFeatures.map((f) => f.name)
    );
  });

  it("level 8 (boundary): still no subclass", () => {
    const result = resolveStabilizedForm(5, 8);
    expect(result.hasSubclass).toBe(false);
    expect(result.subclass).toBeNull();
  });

  it("level 9: includes subclass selection", () => {
    const result = resolveStabilizedForm(1, 9);
    expect(result.hasSubclass).toBe(true);
    expect(result.subclass).not.toBeNull();
    expect(result.subclass!.level9Feature).toBeDefined();
    // level 9 does NOT include level13 or level17 features
    expect(result.hasSignatureAbility).toBe(false);
    expect(result.hasCapstone).toBe(false);
    // Available features should include base + level9 subclass feature
    expect(result.availableFeatures).toContain(
      result.subclass!.level9Feature.name
    );
  });

  it("level 12 (boundary): subclass but no signature ability", () => {
    const result = resolveStabilizedForm(2, 12);
    expect(result.hasSubclass).toBe(true);
    expect(result.hasSignatureAbility).toBe(false);
    expect(result.hasCapstone).toBe(false);
  });

  it("level 13: includes signature ability (level13Feature)", () => {
    const result = resolveStabilizedForm(1, 13);
    expect(result.hasSubclass).toBe(true);
    expect(result.hasSignatureAbility).toBe(true);
    expect(result.subclass!.level13Feature).toBeDefined();
    expect(result.hasCapstone).toBe(false);
    // Available features include base + level9 + level13
    expect(result.availableFeatures).toContain(
      result.subclass!.level9Feature.name
    );
    expect(result.availableFeatures).toContain(
      result.subclass!.level13Feature.name
    );
  });

  it("level 16 (boundary): includes signature but no capstone", () => {
    const result = resolveStabilizedForm(3, 16);
    expect(result.hasSignatureAbility).toBe(true);
    expect(result.hasCapstone).toBe(false);
  });

  it("level 17: includes capstone (level17Feature)", () => {
    const result = resolveStabilizedForm(1, 17);
    expect(result.hasSubclass).toBe(true);
    expect(result.hasSignatureAbility).toBe(true);
    expect(result.hasCapstone).toBe(true);
    expect(result.subclass!.level17Feature).toBeDefined();
    // Available features include base + level9 + level13 + level17
    expect(result.availableFeatures).toContain(
      result.subclass!.level17Feature.name
    );
  });

  it("level 20: same as level 17-19, includes all features", () => {
    const result = resolveStabilizedForm(1, 20);
    expect(result.hasSubclass).toBe(true);
    expect(result.hasSignatureAbility).toBe(true);
    expect(result.hasCapstone).toBe(true);
  });

  it("form lookup: each formId 1-12 returns valid data", () => {
    for (let id = 1; id <= 12; id++) {
      const result = resolveStabilizedForm(id, 5);
      expect(result.form.id).toBe(id);
      expect(result.form.name).toBeTruthy();
      expect(result.form.baseFeatures.length).toBeGreaterThan(0);
    }
  });

  it("form lookup: each formId 1-12 at level 9 resolves a valid subclass", () => {
    for (let id = 1; id <= 12; id++) {
      const result = resolveStabilizedForm(id, 9);
      expect(result.subclass).not.toBeNull();
      expect(result.subclass!.id).toBeTruthy();
      expect(result.subclass!.name).toBeTruthy();
    }
  });
});

describe("FAVORED and MASTER outcome helpers (form selection)", () => {
  it("all stabilized forms are accessible by their id", () => {
    const allForms = STABILIZED_FORMS;
    expect(allForms.length).toBeGreaterThanOrEqual(12);
    for (const form of allForms) {
      const found = allForms.find((f) => f.id === form.id);
      expect(found).toBeDefined();
    }
  });
});

describe("getSecondaryFormFeatures", () => {
  it("returns 1 feature at level 11 (below 17)", () => {
    const features = getSecondaryFormFeatures(1, 11);
    expect(features.length).toBe(1);
  });

  it("returns 1 feature at level 16 (boundary below 17)", () => {
    const features = getSecondaryFormFeatures(1, 16);
    expect(features.length).toBe(1);
  });

  it("returns 2 features at level 17+", () => {
    const features = getSecondaryFormFeatures(1, 17);
    expect(features.length).toBe(2);
  });

  it("returns 2 features at level 20", () => {
    const features = getSecondaryFormFeatures(1, 20);
    expect(features.length).toBe(2);
  });

  it("features are valid base feature names from the form", () => {
    const tempest = STABILIZED_FORMS.find((f) => f.id === 1)!;
    const allBaseNames = tempest.baseFeatures.map((f) => f.name);
    const features = getSecondaryFormFeatures(1, 17);
    for (const name of features) {
      expect(allBaseNames).toContain(name);
    }
  });

  it("without level argument returns all base features (backward compat)", () => {
    const tempest = STABILIZED_FORMS.find((f) => f.id === 1)!;
    const features = getSecondaryFormFeatures(1);
    expect(features).toEqual(tempest.baseFeatures.map((f) => f.name));
  });

  it("returns non-empty arrays for all valid form ids at level 11", () => {
    for (let id = 1; id <= 12; id++) {
      const features = getSecondaryFormFeatures(id, 11);
      expect(Array.isArray(features)).toBe(true);
      expect(features.length).toBeGreaterThan(0);
    }
  });
});
