"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import type { Character, DailyState, DDBSyncSettings } from "@/types/character";
import { generateFullSync } from "@/integrations/ddb-sync";
import type { SyncResult } from "@/integrations/ddb-sync";
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

const SYNC_TOGGLE_LABELS: { key: keyof DDBSyncSettings; label: string; description: string }[] = [
  { key: "syncAbilityScores", label: "Ability Scores", description: "Base scores with daily ability swap applied" },
  { key: "syncHP", label: "Hit Points", description: "Current HP and temporary HP" },
  { key: "syncSpellSlots", label: "Spell Slots", description: "Used and maximum slots per level" },
  { key: "syncConditions", label: "Conditions", description: "Exhaustion and other active conditions" },
  { key: "syncInventory", label: "Inventory", description: "All items with equipped status" },
  { key: "syncCurrency", label: "Currency", description: "CP, SP, EP, GP, and PP" },
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

  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

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
    if (!character) return;
    const characterWithSettings: Character = {
      ...character,
      ddbCharacterId: ddbCharacterId.trim() || null,
      ddbSyncSettings: syncSettings,
    };
    const result = generateFullSync(characterWithSettings, dailyState);
    setSyncResult(result);
  }, [character, dailyState, ddbCharacterId, syncSettings]);

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
      setSaveError("Network error -- please try again");
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
          <h1 className="font-heading text-2xl text-text-highlight">
            Settings
          </h1>
          <p className="text-text-secondary font-body text-sm mt-1">
            {character.name} — D&D Beyond integration settings
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
            Found in the character sheet URL on D&D Beyond.
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-text-primary">
              Sync Options
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={syncSettings.enabled}
                onChange={() => handleToggle("enabled")}
                className="w-4 h-4 accent-accent cursor-pointer"
              />
              <span className="font-body text-xs text-text-secondary uppercase tracking-wide">
                Enabled
              </span>
            </label>
          </div>
          <div className="space-y-3">
            {SYNC_TOGGLE_LABELS.map(({ key, label, description }) => (
              <label
                key={key}
                className={`flex items-start gap-3 cursor-pointer group ${
                  !syncSettings.enabled ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!syncSettings[key]}
                  onChange={() => handleToggle(key)}
                  disabled={!syncSettings.enabled}
                  className="w-4 h-4 mt-0.5 accent-accent cursor-pointer"
                />
                <div>
                  <span className="font-body text-sm text-text-primary group-hover:text-accent transition-colors">
                    {label}
                  </span>
                  <p className="font-body text-xs text-text-secondary">
                    {description}
                  </p>
                </div>
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
            Sync Preview
          </h2>
          <p className="text-text-secondary font-body text-sm mb-4">
            Generates MCP tool payloads for the current character state.
            Copy the output and run via Claude Code with the D&D Beyond MCP
            tools.
          </p>
          <button
            onClick={handleGenerateSync}
            disabled={!syncSettings.enabled || !ddbCharacterId.trim()}
            className="bg-accent text-bg-deep font-heading text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Sync Commands
          </button>
          {!ddbCharacterId.trim() && (
            <p className="text-text-secondary font-body text-xs mt-2">
              Enter a DDB Character ID above to generate sync commands.
            </p>
          )}
          {syncResult !== null && (
            <div className="mt-4 space-y-3">
              {/* Errors */}
              {syncResult.errors.length > 0 && (
                <div className="bg-bg-elevated border border-red-500/30 rounded-md p-3">
                  <p className="text-red-400 font-body text-xs font-semibold mb-1">Errors:</p>
                  <ul className="list-disc list-inside text-red-400/80 font-body text-xs space-y-0.5">
                    {syncResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Skipped */}
              {syncResult.skipped.length > 0 && (
                <p className="text-text-secondary font-body text-xs">
                  Skipped: {syncResult.skipped.join(", ")}
                </p>
              )}
              {/* Payloads */}
              {syncResult.calls.length > 0 && (
                <>
                  <p className="text-text-secondary font-body text-xs">
                    {syncResult.calls.length} command(s) generated:
                  </p>
                  <pre className="bg-bg-elevated border border-border-subtle rounded-md p-3 text-xs font-mono text-text-primary overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {JSON.stringify(syncResult.calls, null, 2)}
                  </pre>
                </>
              )}
              {syncResult.calls.length === 0 && syncResult.errors.length === 0 && (
                <p className="text-text-secondary font-body text-xs">
                  No commands generated. Check that sync is enabled and fields are toggled on.
                </p>
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
