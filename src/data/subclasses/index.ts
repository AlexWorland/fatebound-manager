import type { SubclassEntry, StabilizedFormId } from "@/types/forms";
import { TEMPEST_SUBCLASSES } from "./tempest";
import { TRICKSTER_SUBCLASSES } from "./trickster";
import { MENDER_SUBCLASSES } from "./mender";
import { SHEPHERD_SUBCLASSES } from "./shepherd";
import { BLADE_SUBCLASSES } from "./blade";
import { FERAL_SUBCLASSES } from "./feral";
import { WARDEN_SUBCLASSES } from "./warden";
import { STALKER_SUBCLASSES } from "./stalker";
import { SHADOW_SUBCLASSES } from "./shadow";
import { CONDUIT_SUBCLASSES } from "./conduit";
import { HEXER_SUBCLASSES } from "./hexer";
import { SAGE_SUBCLASSES } from "./sage";
import { TINKER_SUBCLASSES } from "./tinker";
import { REAVER_SUBCLASSES } from "./reaver";

export {
  TEMPEST_SUBCLASSES,
  TRICKSTER_SUBCLASSES,
  MENDER_SUBCLASSES,
  SHEPHERD_SUBCLASSES,
  BLADE_SUBCLASSES,
  FERAL_SUBCLASSES,
  WARDEN_SUBCLASSES,
  STALKER_SUBCLASSES,
  SHADOW_SUBCLASSES,
  CONDUIT_SUBCLASSES,
  HEXER_SUBCLASSES,
  SAGE_SUBCLASSES,
  TINKER_SUBCLASSES,
  REAVER_SUBCLASSES,
};

const SUBCLASS_MAP: Record<StabilizedFormId, SubclassEntry[]> = {
  1: TEMPEST_SUBCLASSES,
  2: TRICKSTER_SUBCLASSES,
  3: MENDER_SUBCLASSES,
  4: SHEPHERD_SUBCLASSES,
  5: BLADE_SUBCLASSES,
  6: FERAL_SUBCLASSES,
  7: WARDEN_SUBCLASSES,
  8: STALKER_SUBCLASSES,
  9: SHADOW_SUBCLASSES,
  10: CONDUIT_SUBCLASSES,
  11: HEXER_SUBCLASSES,
  12: SAGE_SUBCLASSES,
  13: TINKER_SUBCLASSES,
  14: REAVER_SUBCLASSES,
};

export function getSubclassesForForm(formId: StabilizedFormId): SubclassEntry[] {
  return SUBCLASS_MAP[formId];
}
