import { notFound } from "next/navigation";
import { getCharacterById } from "@/lib/characters";
import { getFormHistory } from "@/lib/form-history";
import { getSessionNotes } from "@/lib/session-notes";
import HistoryClient from "./HistoryClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryPage({ params }: PageProps) {
  const { id } = await params;

  const character = getCharacterById(id);
  if (!character) {
    notFound();
  }

  const history = getFormHistory(id);
  const notes = getSessionNotes(id);

  return (
    <HistoryClient character={character} history={history} notes={notes} />
  );
}
