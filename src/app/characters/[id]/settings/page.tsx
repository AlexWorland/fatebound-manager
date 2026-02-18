"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import type { Character, DailyState, DDBSyncSettings } from "@/types/character";
import { generateFullSync } from "@/integrations/ddb-sync";
import type { SyncPayload } from "@/integrations/ddb-sync";
import Card from "@/components/ui/Card";

const DEFAULT_SYNC_SETTINGS: DDBSyncSettings = {
  enabled: true,
  syncAbilityScores: true,
  syncHP: true,
  syncSpellSlots: true,
  syncConditions: false,
  syncInventory: false,
  syncCurrency: false,
  lastSyncedAt: null,
};

const SYNC_TOGGLE_LABELS: { key: keyof DDBSyncSettings; label: string }[] = [
  { key: "syncAbilityScores", label: "Sync Ability Scores" },
  { key: "syncHP", label: "Sync HP" },
  { key: "syncSpellSlots", label: "Sync Spell Slots" },
  { key: "syncConditions", label: "Sync Conditions" },
  { key: "syncInventory", label: "Sync Inventory" },
  { key: "syncCurrency", label: "Sync Currency" },
];

export default function SettingsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [character, setCharacter] = useState<Character | null>(null);
  const [dailyState, setDailyState] = useState<DailyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [ddbCharacterId, setDdbCharacterId] = useState("");
  const [syncSettings, setSyncSettings] =
    useState<DDBSyncSettings>(DEFAULT_SYNC_SETTINGS);

  const [syncPayloads, setSyncPayloads] = useState<SyncPayload[] | null>(null);

  useEffect(() => {
    fetch(`/api/characters/${id}`)
      .then((res) => res.json())
      .then(
        (data: { character: Character; dailyState: DailyState | null }) => {
          setCharacter(data.character);
          setDailyState(data.dailyState);
          setDdbCharacterId(data.character.ddbCharacterId ?? "");
          setSyncSettings(
            data.character.ddbSyncSettings ?? DEFAULT_SYNC_SETTINGS
          );
        }
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggle = useCallback(
    (key: keyof DDBSyncSettings) => {
      setSyncSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    },
    []
  );

  const handleGenerateSync = useCallback(() => {
    if (!character || !dailyState) return;
    const characterWithId: Character = {
      ...character,
      ddbCharacterId: ddbCharacterId.trim() || null,
    };
    const payloads = generateFullSync(characterWithId, dailyState);
    setSyncPayloads(payloads);
  }, [character, dailyState, ddbCharacterId]);

  const handleSave = useCallback(async () => {
    if (!character) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/characters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ddbCharacterId: ddbCharacterId.trim() || null,
          ddbSyncSettings: syncSettings,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSaveError((body as { error?: string }).error ?? "Save failed");
        return;
      }

      const updated = (await res.json()) as Character;
      setCharacter(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }, [id, character, ddbCharacterId, syncSettings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <p className="text-text-secondary font-body">Loading settings...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <p className="text-text-secondary font-body">Character not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl text-text-primary">
            Settings — {character.name}
          </h1>
          <p className="text-text-secondary font-body text-sm mt-1">
            Configure D&D Beyond sync settings for this character.
          </p>
        </div>

        {/* DDB Character ID */}
        <Card>
          <h2 className="font-heading text-lg text-text-primary mb-3">
            D&D Beyond Character ID
          </h2>
          <label
            htmlFor="ddbCharacterId"
            className="block text-sm text-text-secondary font-body mb-1"
          >
            Enter your D&D Beyond character ID (found in the character URL).
          </label>
          <input
            id="ddbCharacterId"
            type="text"
            value={ddbCharacterId}
            onChange={(e) => setDdbCharacterId(e.target.value)}
            placeholder="e.g. 123456789"
            className="w-full bg-bg-elevated border border-border-subtle rounded-md px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
        </Card>

        {/* Sync Toggles */}
        <Card>
          <h2 className="font-heading text-lg text-text-primary mb-3">
            Sync Options
          </h2>
          <div className="space-y-3">
            {SYNC_TOGGLE_LABELS.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={!!syncSettings[key]}
                  onChange={() => handleToggle(key)}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <span className="font-body text-sm text-text-primary group-hover:text-accent transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Last Synced */}
        {syncSettings.lastSyncedAt && (
          <Card>
            <p className="text-text-secondary font-body text-sm">
              Last synced:{" "}
              <span className="text-text-primary font-mono text-xs">
                {new Date(syncSettings.lastSyncedAt).toLocaleString()}
              </span>
            </p>
          </Card>
        )}

        {/* Generate Sync Commands */}
        <Card>
          <h2 className="font-heading text-lg text-text-primary mb-3">
            Generate Sync Commands
          </h2>
          <p className="text-text-secondary font-body text-sm mb-4">
            Generates MCP tool payloads based on the current character state.
            Copy the output and run it via Claude Code with the D&D Beyond MCP
            tools.
          </p>
          <button
            onClick={handleGenerateSync}
            disabled={!dailyState}
            className="bg-accent text-bg-deep font-heading text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Sync Commands
          </button>
          {!dailyState && (
            <p className="text-text-secondary font-body text-xs mt-2">
              No daily state found — complete a Dawn Roll to generate sync
              commands.
            </p>
          )}
          {syncPayloads !== null && (
            <div className="mt-4">
              <p className="text-text-secondary font-body text-xs mb-2">
                {syncPayloads.length === 0
                  ? "No payloads generated — set a DDB Character ID above."
                  : `${syncPayloads.length} command(s) generated:`}
              </p>
              {syncPayloads.length > 0 && (
                <pre className="bg-bg-elevated border border-border-subtle rounded-md p-3 text-xs font-mono text-text-primary overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(syncPayloads, null, 2)}
                </pre>
              )}
            </div>
          )}
        </Card>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent text-bg-deep font-heading text-sm px-6 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saveSuccess && (
            <span className="text-accent font-body text-sm">Saved.</span>
          )}
          {saveError && (
            <span className="text-red-400 font-body text-sm">{saveError}</span>
          )}
        </div>
      </div>
    </div>
  );
}
