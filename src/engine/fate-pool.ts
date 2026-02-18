/** Fate Pool module — re-exports pool-specific functions from residual-memory.
 *  The Fate Pool shares the same slot count as Residual Memory but governs
 *  allocation decisions at level 11+ (Dual Nature unlock). */
export {
  getFatePoolSize,
  isFeatureRetainable,
  validateMemoryAllocation,
} from "./residual-memory";

export type { MemoryAllocation, ValidationResult } from "./residual-memory";
