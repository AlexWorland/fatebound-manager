"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export interface FateAbilityButtonProps {
  label: string;
  description: string;
  isUsed: boolean;
  onToggle: () => void;
}

function getFirstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0] : text.slice(0, 80) + (text.length > 80 ? "..." : "");
}

export default function FateAbilityButton({
  label,
  description,
  isUsed,
  onToggle,
}: FateAbilityButtonProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openPopover = useCallback(() => {
    // Clear tooltip and show popover
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    setTooltipVisible(false);
    setPopoverOpen(true);
  }, []);

  const closePopover = useCallback(() => {
    setPopoverOpen(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (popoverOpen) return;
    tooltipTimerRef.current = setTimeout(() => {
      setTooltipVisible(true);
    }, 300);
  }, [popoverOpen]);

  const handleMouseLeave = useCallback(() => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    setTooltipVisible(false);
  }, []);

  const handleToggle = useCallback(() => {
    onToggle();
    closePopover();
  }, [onToggle, closePopover]);

  // Click outside to close popover
  useEffect(() => {
    if (!popoverOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverOpen, closePopover]);

  // Escape key to close popover
  useEffect(() => {
    if (!popoverOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closePopover();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [popoverOpen, closePopover]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  const firstSentence = getFirstSentence(description);

  return (
    <div ref={containerRef} className="relative">
      {/* Main button */}
      <button
        onClick={openPopover}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center gap-1.5 hover:text-text-highlight transition-colors"
      >
        <span
          className={`w-3.5 h-3.5 rounded-full border transition-colors ${
            isUsed
              ? "bg-transparent border-border-subtle"
              : "bg-hp-green border-transparent"
          }`}
        />
        {label}
      </button>

      {/* Tooltip */}
      {tooltipVisible && !popoverOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none"
          role="tooltip"
        >
          <div className="bg-bg-elevated border border-border-subtle rounded px-3 py-2 shadow-lg max-w-[250px]">
            <p className="text-xs text-text-secondary font-body leading-relaxed">
              {firstSentence}
            </p>
          </div>
        </div>
      )}

      {/* Popover */}
      {popoverOpen && (
        <div
          className="absolute top-full left-0 mt-2 z-50 w-[280px]"
          role="dialog"
          aria-label={`${label} details`}
        >
          <div className="bg-bg-elevated border border-border-subtle rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-2 border-b border-border-subtle">
              <h3 className="text-sm font-heading text-text-highlight">{label}</h3>
              <p className="text-xs text-text-secondary font-body mt-0.5">Once per long rest</p>
            </div>

            {/* Description */}
            <div className="px-4 py-3">
              <p className="text-xs text-text-secondary font-body leading-relaxed">
                {description}
              </p>
            </div>

            {/* Action button */}
            <div className="px-4 pb-4">
              <button
                onClick={handleToggle}
                className={`w-full px-3 py-2 text-xs font-condensed font-bold uppercase tracking-wider rounded transition-colors ${
                  isUsed
                    ? "border border-border-subtle text-text-secondary hover:text-text-highlight hover:border-text-secondary"
                    : "bg-hp-green/20 border border-hp-green text-hp-green hover:bg-hp-green/30"
                }`}
              >
                {isUsed ? "Mark as Ready" : "Mark as Used"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
