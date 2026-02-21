"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import type { Character } from "@/types/character";

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function CharacterCard({
  character,
  onClick,
}: {
  character: Character;
  onClick: () => void;
}) {
  const highestScore = (
    Object.entries(character.abilityScores) as [string, number][]
  ).sort((a, b) => b[1] - a[1])[0];

  return (
    <button onClick={onClick} className="text-left w-full group">
      <Card className="transition-all duration-150 hover:shadow-elevated hover:border-border-subtle group-hover:shadow-elevated">
        <div className="flex flex-col gap-3">
          {/* Name and level */}
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-heading text-text-highlight truncate">
              {character.name}
            </h2>
            <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full bg-bg-elevated text-xs font-mono text-text-secondary border border-border-subtle">
              Lv {character.level}
            </span>
          </div>

          {/* Background */}
          {character.background && (
            <p className="text-sm text-text-secondary truncate">
              {character.background}
            </p>
          )}

          {/* Quick stat bar */}
          <div className="flex items-center gap-3 text-xs text-text-secondary font-body">
            {highestScore && (
              <span>
                <span className="text-text-primary font-medium">
                  {highestScore[0]}
                </span>{" "}
                {highestScore[1]} ({getModifier(highestScore[1])})
              </span>
            )}
            <span className="text-border-subtle">|</span>
            <span className="truncate">
              {character.permanentSkills.join(", ")}
            </span>
          </div>

          {/* Created date */}
          <div className="text-xs text-text-secondary font-mono pt-2 border-t border-border-subtle">
            Created {new Date(character.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Card>
    </button>
  );
}

export default function CharacterListPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/characters")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch characters");
        return res.json() as Promise<Character[]>;
      })
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-bg-deep">
      <header className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading text-text-highlight">
              The Fatebound
            </h1>
            <p className="text-sm text-text-secondary mt-1">Character Manager</p>
          </div>
          <button
            onClick={() => router.push("/characters/new")}
            className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors"
          >
            New Character
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <p className="text-text-secondary font-body text-center py-16">
            Loading characters...
          </p>
        )}

        {error && (
          <p className="text-hp-red font-body text-center py-16">{error}</p>
        )}

        {!loading && !error && characters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center mb-6">
              <span className="text-2xl text-fate font-heading">?</span>
            </div>
            <h2 className="text-xl font-heading text-text-highlight mb-2">
              No Characters Yet
            </h2>
            <p className="text-text-secondary mb-6 max-w-sm">
              Create your first Fatebound character to begin rolling on the
              tables of fate.
            </p>
            <button
              onClick={() => router.push("/characters/new")}
              className="px-6 py-3 rounded bg-accent hover:bg-accent-hover text-white font-condensed font-bold uppercase tracking-wider text-xs transition-colors"
            >
              Create Character
            </button>
          </div>
        )}

        {!loading && !error && characters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => router.push(`/characters/${character.id}`)}
              />
            ))}

            {/* New character card */}
            <button
              onClick={() => router.push("/characters/new")}
              className="block group"
            >
              <div className="border-2 border-dashed border-border-subtle rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] transition-colors duration-150 hover:border-fate group-hover:bg-bg-surface/50">
                <span className="text-3xl text-text-secondary group-hover:text-fate transition-colors mb-2">
                  +
                </span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  New Character
                </span>
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
