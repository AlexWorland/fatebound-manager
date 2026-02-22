"use client";

function Line({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return <div className="animate-pulse rounded bg-bg-elevated" style={{ width, height }} />;
}

function Circle({ size = "2.5rem" }: { size?: string }) {
  return <div className="animate-pulse rounded-full bg-bg-elevated" style={{ width: size, height: size }} />;
}

function Card() {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-4 space-y-3">
      <Line width="60%" height="1.25rem" />
      <Line width="100%" />
      <Line width="80%" />
    </div>
  );
}

const Skeleton = { Line, Circle, Card };
export default Skeleton;
