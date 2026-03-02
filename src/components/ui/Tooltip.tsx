"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface TooltipProps {
  content: string | ReactNode;
  position?: "top" | "bottom";
  delay?: number;
  children: ReactNode;
}

export default function Tooltip({
  content,
  position = "top",
  delay = 300,
  children,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Position tooltip relative to wrapper
      if (wrapperRef.current && tooltipRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = wrapperRect.width / 2 - tooltipRect.width / 2;

        if (position === "top") {
          top = -tooltipRect.height - 8;
        } else {
          top = wrapperRect.height + 8;
        }

        setTooltipPos({ top, left });
      }
    }, delay);
  }

  function handleMouseLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute bg-bg-elevated border border-border-subtle rounded px-3 py-2 text-sm text-text-primary shadow-lg pointer-events-none z-50 whitespace-nowrap"
          style={{
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
            transform: "translateX(-50%)",
            marginLeft: "50%",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
