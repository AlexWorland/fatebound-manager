"use client";

import React from "react";

interface TabNavProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex items-end border-b border-border-subtle">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2.5 text-sm font-body tracking-widest uppercase transition-colors duration-150
              relative border-b-2 -mb-px
              ${
                isActive
                  ? "text-text-highlight border-accent"
                  : "text-text-secondary border-transparent hover:text-text-primary hover:border-border-subtle"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
