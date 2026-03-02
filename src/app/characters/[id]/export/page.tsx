"use client";
import { useParams } from "next/navigation";

export default function ExportPage() {
  const params = useParams();
  const id = params.id as string;

  const handleExport = () => {
    window.open(`/api/characters/${id}/export`, "_blank");
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-heading mb-4">Export Character Sheet</h1>
      <p className="text-sm text-gray-400 mb-6">
        Download a D&D 5e-style character sheet PDF with your current stats,
        form, and equipment.
      </p>
      <button
        onClick={handleExport}
        className="px-6 py-3 bg-accent text-white rounded hover:opacity-90 transition-opacity"
      >
        Download PDF
      </button>
    </div>
  );
}
