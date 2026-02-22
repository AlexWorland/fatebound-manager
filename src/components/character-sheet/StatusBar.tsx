"use client";

interface StatusBarProps {
  inspiration: boolean;
  concentrationSpell: string | null;
  onInspirationToggle: () => void;
  onConcentrationDismiss: () => void;
}

export default function StatusBar({
  inspiration,
  concentrationSpell,
  onInspirationToggle,
  onConcentrationDismiss,
}: StatusBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Inspiration Toggle - Star icon, glows fate-purple when active */}
      <button
        onClick={onInspirationToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
          inspiration
            ? "border-fate bg-fate/20 text-fate-glow"
            : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-fate/50"
        }`}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill={inspiration ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Inspiration
      </button>

      {/* Concentration Indicator */}
      {concentrationSpell ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-text-primary text-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Concentrating: {concentrationSpell}
          <button
            onClick={onConcentrationDismiss}
            className="ml-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            ×
          </button>
        </div>
      ) : (
        <span className="text-xs text-text-secondary">No Concentration</span>
      )}
    </div>
  );
}
