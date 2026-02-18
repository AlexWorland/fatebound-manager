import { describe, it, expect } from "vitest";
import { resolveDawnRollOutcome } from "../dawn-roll";

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
  it("returns UNSTABLE for rolls 11-15 below level 5", () => {
    expect(resolveDawnRollOutcome(12, 3)).toBe("UNSTABLE");
  });
  it("returns GUIDED for rolls 11-15 at level 5+", () => {
    expect(resolveDawnRollOutcome(12, 5)).toBe("GUIDED");
  });
  it("returns FAVORED for rolls 16-19 at level 5+", () => {
    expect(resolveDawnRollOutcome(17, 5)).toBe("FAVORED");
  });
  it("returns UNSTABLE for rolls 16-19 below level 5", () => {
    expect(resolveDawnRollOutcome(17, 3)).toBe("UNSTABLE");
  });
  it("returns MASTER for roll of 20", () => {
    expect(resolveDawnRollOutcome(20, 1)).toBe("MASTER");
  });
});
