"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "fate" | "accent";
}

export default function Card({ children, className = "", variant = "default" }: CardProps) {
  const variantClasses = {
    default: "border-border-subtle",
    fate: "border-fate",
    accent: "border-border-accent",
  };

  return (
    <div
      className={`bg-bg-surface border rounded p-3 shadow-card ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
