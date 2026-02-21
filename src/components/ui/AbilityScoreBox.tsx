"use client";

interface AbilityScoreBoxProps {
  ability: string;
  score: number;
  modifier: number;
  isSwapped?: boolean;
  saveProficient?: boolean;
  saveModifier?: number;
}

export default function AbilityScoreBox({
  ability,
  score,
  modifier,
  isSwapped = false,
  saveProficient = false,
  saveModifier,
}: AbilityScoreBoxProps) {
  const borderClass = isSwapped ? "border-fate" : "border-border-subtle";
  const modifierTextClass = isSwapped ? "text-fate" : "text-text-primary";
  const modifierDisplay = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  const saveModDisplay =
    saveModifier !== undefined
      ? saveModifier >= 0
        ? `+${saveModifier}`
        : `${saveModifier}`
      : null;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Main box */}
      <div
        className={`w-[72px] h-[80px] border ${borderClass} rounded bg-bg-surface flex flex-col items-center justify-center relative`}
      >
        {/* Modifier — top section */}
        <div className={`text-xl font-medium leading-none ${modifierTextClass}`}>
          {modifierDisplay}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border-subtle my-1.5" />

        {/* Score — bottom section */}
        <div className="text-sm font-bold text-text-secondary leading-none">
          {score}
        </div>
      </div>

      {/* Ability label below box */}
      <div className="text-[10px] font-bold font-condensed uppercase text-text-secondary tracking-wider">
        {ability}
      </div>

      {/* Save proficiency row */}
      {saveModDisplay !== null && (
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              saveProficient
                ? "bg-accent"
                : "border border-text-muted bg-transparent"
            }`}
          />
          <span className="text-[10px] font-condensed text-text-muted">
            {saveModDisplay}
          </span>
        </div>
      )}
    </div>
  );
}
