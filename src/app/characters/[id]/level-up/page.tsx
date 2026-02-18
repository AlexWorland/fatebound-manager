import { notFound } from "next/navigation";
import { getCharacterById } from "@/lib/characters";
import LevelUpClient from "./LevelUpClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LevelUpPage({ params }: PageProps) {
  const { id } = await params;

  const character = getCharacterById(id);
  if (!character) {
    notFound();
  }

  if (character.level >= 20) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h1 className="font-heading text-2xl text-text-highlight mb-2">
            Lord of Chaos
          </h1>
          <p className="text-text-secondary text-sm">
            {character.name} is already at the maximum level (20).
          </p>
          <a
            href={`/characters/${id}`}
            className="inline-block mt-6 text-accent hover:text-accent-hover text-sm font-body transition-colors"
          >
            Back to Character Sheet
          </a>
        </div>
      </div>
    );
  }

  return <LevelUpClient character={character} />;
}
