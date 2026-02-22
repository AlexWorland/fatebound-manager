"use client";
import { useState, useCallback } from "react";

export function useExpandedState(key: string, defaultExpanded: string[] = []) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem(`expanded:${key}`) : null;
      return new Set(stored ? JSON.parse(stored) : defaultExpanded);
    } catch {
      return new Set(defaultExpanded);
    }
  });

  const toggle = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(`expanded:${key}`, JSON.stringify([...next]));
          }
        } catch {}
        return next;
      });
    },
    [key]
  );

  const isExpanded = useCallback((id: string) => expanded.has(id), [expanded]);

  return { isExpanded, toggle };
}
