"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createPreset,
  deletePreset,
  getPreset,
  listPresets,
} from "../api/get-portfolio-screen-data";
import type {
  PortfolioManager,
  PortfolioPresetSummary,
  PresetManagerInput,
} from "../types";
import { PresetSaveModal } from "./preset-save-modal";

// The "Default" option represents the client's untouched base book (proposed ==
// current). It is not a stored preset — selecting it reloads the base.
const DEFAULT_ID = "default";

type Props = {
  client: string | null;
  managers: PortfolioManager[];
  // Apply a preset's saved inputs to the live portfolio (triggers recompute).
  onApplyPreset: (managers: PresetManagerInput[]) => void;
  // Reset to the untouched base book (the "Default" preset).
  onSelectDefault: () => void;
};

function toPayloadManagers(managers: PortfolioManager[]): PresetManagerInput[] {
  return managers.map((m) => ({
    tab: m.tab,
    matched_name: m.matched_name,
    weight_file_name: m.weight_file_name ?? m.matched_name,
    current_weight: m.current_weight,
    proposed_weight: m.proposed_weight,
    style_buckets: m.style_buckets ?? null,
    is_placeholder: m.is_placeholder ?? false,
  }));
}

export function PresetBar({ client, managers, onApplyPreset, onSelectDefault }: Props) {
  const [presets, setPresets] = useState<PortfolioPresetSummary[]>([]);
  const [selected, setSelected] = useState<string>(DEFAULT_ID);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!client) {
      setPresets([]);
      return;
    }
    try {
      const res = await listPresets(client);
      setPresets(res.presets ?? []);
    } catch {
      setPresets([]);
    }
  }, [client]);

  // Reload presets and reset to Default whenever the client changes.
  useEffect(() => {
    setSelected(DEFAULT_ID);
    setError(null);
    void refresh();
  }, [client, refresh]);

  const handleSelect = useCallback(
    async (value: string) => {
      setError(null);
      setSelected(value);
      if (value === DEFAULT_ID) {
        onSelectDefault();
        return;
      }
      if (!client) {
        return;
      }
      setBusy(true);
      try {
        const detail = await getPreset(client, Number(value));
        onApplyPreset(detail.payload?.managers ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load preset.");
      } finally {
        setBusy(false);
      }
    },
    [client, onApplyPreset, onSelectDefault],
  );

  const handleSaveSubmit = useCallback(
    async (input: { name: string; createdBy: string | null }) => {
      if (!client || !managers.length) {
        return;
      }
      // Errors thrown here surface inside the modal (it awaits this promise).
      const res = await createPreset(client, {
        name: input.name,
        created_by: input.createdBy,
        payload: { managers: toPayloadManagers(managers) },
      });
      await refresh();
      setSelected(String(res.preset.id));
    },
    [client, managers, refresh],
  );

  const handleDelete = useCallback(async () => {
    if (!client || selected === DEFAULT_ID) {
      return;
    }
    const preset = presets.find((p) => String(p.id) === selected);
    if (!preset) {
      return;
    }
    if (!window.confirm(`Delete preset “${preset.name}”? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await deletePreset(client, preset.id);
      await refresh();
      setSelected(DEFAULT_ID);
      onSelectDefault();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete preset.");
    } finally {
      setBusy(false);
    }
  }, [client, selected, presets, refresh, onSelectDefault]);

  return (
    <div className="flex items-center" style={{ gap: 6 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
        Preset:
      </span>
      <div className="select-wrap">
        <select
          value={selected}
          disabled={!client || busy}
          onChange={(event) => void handleSelect(event.target.value)}
        >
          <option value={DEFAULT_ID}>Default (base book)</option>
          {presets.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name}
              {p.created_by ? ` — ${p.created_by}` : ""}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        title="Save the current portfolio numbers as a new named preset"
        disabled={!client || !managers.length || busy}
        onClick={() => setSaveOpen(true)}
      >
        Save preset
      </button>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        title="Delete the selected preset"
        disabled={selected === DEFAULT_ID || busy}
        style={{ color: "var(--danger, #c0392b)", borderColor: "var(--danger, #c0392b)" }}
        onClick={() => void handleDelete()}
      >
        Delete preset
      </button>
      {error ? (
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--danger, #c0392b)" }}>
          {error}
        </span>
      ) : null}
      <PresetSaveModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSubmit={handleSaveSubmit}
      />
    </div>
  );
}
