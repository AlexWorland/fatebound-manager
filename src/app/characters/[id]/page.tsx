import { notFound } from "next/navigation";
import { getCharacterById } from "@/lib/characters";
import { getCurrentDailyState } from "@/lib/daily-states";
import CharacterSheetClient from "./CharacterSheetClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterSheetPage({ params }: PageProps) {
  const { id } = await params;

  const character = getCharacterById(id);
  if (!character) {
    notFound();
  }

  const dailyState = getCurrentDailyState(id);

  return <CharacterSheetClient character={character} dailyState={dailyState} />;
}
