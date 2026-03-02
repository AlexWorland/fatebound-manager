"use client";

interface DeathSavesProps {
  successes: number;
  failures: number;
  onUpdate: (successes: number, failures: number) => void;
  visible: boolean;
}

export default function DeathSaves({
  successes,
  failures,
  onUpdate,
  visible,
}: DeathSavesProps) {
  if (!visible) return null;

  const handleSuccessToggle = (index: number) => {
    const newSuccesses = successes === index + 1 ? index : index + 1;
    onUpdate(newSuccesses, failures);
  };

  const handleFailureToggle = (index: number) => {
    const newFailures = failures === index + 1 ? index : index + 1;
    onUpdate(successes, newFailures);
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-bg-elevated rounded-lg border border-border-subtle">
      <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest">
        Death Saves
      </h3>

      {/* Successes */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary font-body w-16">Successes</span>
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <button
              key={`success-${index}`}
              onClick={() => handleSuccessToggle(index)}
              className={`w-5 h-5 rounded-full border-2 transition-colors ${
                successes > index
                  ? "bg-hp-green border-hp-green"
                  : "border-border-subtle hover:border-hp-green/50"
              }`}
              aria-label={`Success ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Failures */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary font-body w-16">Failures</span>
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <button
              key={`failure-${index}`}
              onClick={() => handleFailureToggle(index)}
              className={`w-5 h-5 rounded-full border-2 transition-colors ${
                failures > index
                  ? "bg-hp-red border-hp-red"
                  : "border-border-subtle hover:border-hp-red/50"
              }`}
              aria-label={`Failure ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
