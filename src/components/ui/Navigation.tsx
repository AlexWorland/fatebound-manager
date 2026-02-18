"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Breadcrumb {
  label: string;
  href: string;
}

function buildBreadcrumbs(pathname: string): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [{ label: "Characters", href: "/characters" }];

  const segments = pathname.split("/").filter(Boolean);
  // /characters/[id] → character detail
  if (segments.length >= 2 && segments[0] === "characters" && segments[1] !== "new") {
    crumbs.push({ label: "Character", href: `/characters/${segments[1]}` });
  }
  // /characters/new
  if (segments[1] === "new") {
    crumbs.push({ label: "New Character", href: "/characters/new" });
  }
  // /characters/[id]/dawn-roll, level-up, history, settings
  if (segments.length >= 3) {
    const routeLabels: Record<string, string> = {
      "dawn-roll": "Dawn Roll",
      "level-up": "Level Up",
      history: "History",
      settings: "Settings",
    };
    const label = routeLabels[segments[2]];
    if (label) {
      crumbs.push({ label, href: pathname });
    }
  }

  return crumbs;
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const breadcrumbs = buildBreadcrumbs(pathname);
  const isHome = pathname === "/" || pathname === "/characters";

  return (
    <nav className="sticky top-0 z-50 bg-bg-surface/95 backdrop-blur-sm border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Title */}
          <Link
            href="/characters"
            className="flex items-center gap-2 group"
          >
            <span className="text-fate text-lg font-bold font-heading tracking-wide group-hover:text-fate-glow transition-colors">
              Fatebound
            </span>
            <span className="text-text-secondary text-xs font-body hidden sm:inline">
              Manager
            </span>
          </Link>

          {/* Breadcrumbs - desktop */}
          {!isHome && (
            <div className="hidden sm:flex items-center gap-1.5 text-sm font-body">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  {i > 0 && (
                    <span className="text-text-secondary mx-1">/</span>
                  )}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-text-primary">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-text-secondary hover:text-accent transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile breadcrumbs */}
        {mobileOpen && !isHome && (
          <div className="sm:hidden pb-3 border-t border-border-subtle pt-2">
            {breadcrumbs.map((crumb, i) => (
              <Link
                key={crumb.href}
                href={crumb.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-1.5 text-sm font-body ${
                  i === breadcrumbs.length - 1
                    ? "text-accent"
                    : "text-text-secondary"
                }`}
                style={{ paddingLeft: `${i * 12 + 8}px` }}
              >
                {crumb.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
