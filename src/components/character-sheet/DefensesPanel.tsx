"use client";

interface DefensesPanelProps {
  movementSpeeds: Record<string, number>;
  resistances: string[];
  immunities: string[];
  vulnerabilities: string[];
}

export default function DefensesPanel({ movementSpeeds, resistances, immunities, vulnerabilities }: DefensesPanelProps) {
  return (
    <div className="space-y-4">
      {/* Defenses Section */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-text-secondary font-heading mb-2">Defenses</h4>
        <div className="space-y-1.5">
          <DefenseRow label="Resistances" items={resistances} />
          <DefenseRow label="Immunities" items={immunities} />
          <DefenseRow label="Vulnerabilities" items={vulnerabilities} />
        </div>
      </div>

      {/* Movement Section */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-text-secondary font-heading mb-2">Movement</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(movementSpeeds).map(([type, speed]) => (
            <div key={type} className="text-center">
              <div className="text-lg font-mono text-text-primary">{speed}</div>
              <div className="text-xs text-text-secondary capitalize">{type} ft.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefenseRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-text-secondary w-28">{label}:</span>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <span key={item} className="px-2 py-0.5 text-xs rounded bg-bg-elevated border border-border-subtle">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-text-secondary">&mdash;</span>
      )}
    </div>
  );
}
