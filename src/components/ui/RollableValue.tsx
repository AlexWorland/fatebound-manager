"use client";
import { ReactNode } from "react";

interface RollableValueProps {
  children: ReactNode;
  onClick?: () => void;
  label?: string;
}

export default function RollableValue({ children, onClick, label }: RollableValueProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 bg-white/5 border border-accent/30 rounded px-1.5 py-0.5 cursor-pointer hover:bg-white/10 transition-colors text-text-primary"
      title={label ? `Roll ${label}` : "Click to roll"}
      type="button"
    >
      {children}
      <svg className="w-3 h-3 text-accent/60" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
      </svg>
    </button>
  );
}
