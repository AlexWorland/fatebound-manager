"use client";

interface DeathSavesProps {
  successes: number;
  failures: number;
  onUpdate: (successes: number, failures: number) => void;
}

interface PipRowProps {
  label: string;
  count: number;
  filledClass: string;
  onChange: (newCount: number) => void;
}

function PipRow({ label, count, filledClass, onChange }: PipRowProps) {
  function togglePip(index: number) {
    // Clicking a filled pip clears it and everything above; clicking an empty pip fills up to it
    if (index < count) {
      onChange(index);
    } else {
      onChange(index + 1);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider w-20">
        {label}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: 3 }, (_, i) => (
          <button
            key={i}
            onClick={() => togglePip(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < count
                ? filledClass
                : "border border-text-muted bg-transparent hover:border-text-secondary"
            }`}
            aria-label={`${label} pip ${i + 1} — ${i < count ? "filled" : "empty"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DeathSaves({ successes, failures, onUpdate }: DeathSavesProps) {
  return (
    <div className="bg-bg-surface rounded p-3">
      <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-2">
        Death Saves
      </div>

      <div className="flex flex-col gap-1.5">
        <PipRow
          label="Successes"
          count={successes}
          filledClass="bg-hp-green"
          onChange={(n) => onUpdate(n, failures)}
        />
        <PipRow
          label="Failures"
          count={failures}
          filledClass="bg-hp-red"
          onChange={(n) => onUpdate(successes, n)}
        />
      </div>
    </div>
  );
}
