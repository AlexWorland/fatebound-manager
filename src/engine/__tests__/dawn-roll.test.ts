import { describe, it, expect } from "vitest";
import {
  resolveDawnRollOutcome,
  hasTwistOfFate,
  hasDefyFate,
  hasLordOfChaos,
} from "../dawn-roll";

describe("resolveDawnRollOutcome", () => {
  it("returns DM_DESIGN for roll of 1", () => {
    expect(resolveDawnRollOutcome(1, 1)).toBe("DM_DESIGN");
  });
  it("returns DEEP_CHAOS for rolls 2-5", () => {
    expect(resolveDawnRollOutcome(3, 1)).toBe("DEEP_CHAOS");
  });
  it("returns UNSTABLE for rolls 6-10", () => {
    expect(resolveDawnRollOutcome(8, 1)).toBe("UNSTABLE");
  });
  it("returns DEEP_CHAOS for rolls 11-15 below level 5", () => {
    expect(resolveDawnRollOutcome(12, 3)).toBe("DEEP_CHAOS");
    expect(resolveDawnRollOutcome(11, 4)).toBe("DEEP_CHAOS");
    expect(resolveDawnRollOutcome(15, 4)).toBe("DEEP_CHAOS");
  });
  it("returns GUIDED for rolls 11-15 at level 5+", () => {
    expect(resolveDawnRollOutcome(12, 5)).toBe("GUIDED");
  });
  it("returns FAVORED for rolls 16-19 at level 5+", () => {
    expect(resolveDawnRollOutcome(17, 5)).toBe("FAVORED");
  });
  it("returns UNSTABLE for rolls 16-19 below level 5", () => {
    expect(resolveDawnRollOutcome(17, 3)).toBe("UNSTABLE");
    expect(resolveDawnRollOutcome(16, 4)).toBe("UNSTABLE");
    expect(resolveDawnRollOutcome(19, 4)).toBe("UNSTABLE");
  });
  it("returns MASTER for roll of 20", () => {
    expect(resolveDawnRollOutcome(20, 1)).toBe("MASTER");
  });
});

describe("hasTwistOfFate (Level 14)", () => {
  it("is not available below level 14", () => {
    expect(hasTwistOfFate(1)).toBe(false);
    expect(hasTwistOfFate(13)).toBe(false);
  });

  it("becomes available at level 14", () => {
    expect(hasTwistOfFate(14)).toBe(true);
  });

  it("remains available at higher levels", () => {
    expect(hasTwistOfFate(18)).toBe(true);
    expect(hasTwistOfFate(20)).toBe(true);
  });
});

describe("hasDefyFate (Level 18)", () => {
  it("is not available below level 18", () => {
    expect(hasDefyFate(1)).toBe(false);
    expect(hasDefyFate(17)).toBe(false);
  });

  it("becomes available at level 18", () => {
    expect(hasDefyFate(18)).toBe(true);
  });

  it("remains available at levels 19 and 20", () => {
    expect(hasDefyFate(19)).toBe(true);
    expect(hasDefyFate(20)).toBe(true);
  });
});

describe("hasLordOfChaos (Level 20)", () => {
  it("is not available below level 20", () => {
    expect(hasLordOfChaos(1)).toBe(false);
    expect(hasLordOfChaos(19)).toBe(false);
  });

  it("becomes available at level 20", () => {
    expect(hasLordOfChaos(20)).toBe(true);
  });
});
