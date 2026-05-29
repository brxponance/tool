"use client";

import type { OptimizerConstraints } from "../types";

type Props = {
  value: OptimizerConstraints;
  onChange: <K extends keyof OptimizerConstraints>(key: K, value: OptimizerConstraints[K]) => void;
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontFamily: "var(--mono)",
  fontSize: 11,
  color: "var(--text2)",
};

const inputStyle: React.CSSProperties = {
  width: 80,
  padding: "4px 6px",
  background: "var(--bg1)",
  border: "1px solid var(--border)",
  color: "var(--text1)",
  fontFamily: "var(--mono)",
  fontSize: 12,
};

// Percent inputs are stored as decimals (0-1); user types whole numbers.
function pctNum(v: number) {
  return Math.round(v * 1000) / 10; // 0.075 → 7.5
}

export function ConstraintInputs({ value, onChange }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        gap: 16,
        marginTop: 12,
      }}
    >
      <label style={fieldStyle}>
        Min weight (%)
        <input
          type="number"
          step="0.5"
          min="0"
          max="50"
          value={pctNum(value.min_weight)}
          onChange={(e) =>
            onChange("min_weight", Math.max(0, Number(e.target.value) / 100))
          }
          style={inputStyle}
        />
      </label>
      <label style={fieldStyle}>
        Max weight (%)
        <input
          type="number"
          step="0.5"
          min="0"
          max="100"
          value={pctNum(value.max_weight)}
          onChange={(e) =>
            onChange("max_weight", Math.max(0, Number(e.target.value) / 100))
          }
          style={inputStyle}
        />
      </label>
      <label style={fieldStyle}>
        Min managers
        <input
          type="number"
          step="1"
          min="1"
          max="20"
          value={value.min_managers}
          onChange={(e) =>
            onChange("min_managers", Math.max(1, Math.floor(Number(e.target.value))))
          }
          style={inputStyle}
        />
      </label>
      <label style={fieldStyle}>
        Max managers
        <input
          type="number"
          step="1"
          min="1"
          max="20"
          value={value.max_managers}
          onChange={(e) =>
            onChange("max_managers", Math.max(1, Math.floor(Number(e.target.value))))
          }
          style={inputStyle}
        />
      </label>
      <label style={fieldStyle}>
        V-G center
        <input
          type="number"
          step="0.01"
          min="-1"
          max="1"
          value={value.vg_center}
          onChange={(e) => onChange("vg_center", Number(e.target.value))}
          style={inputStyle}
        />
      </label>
      <label style={fieldStyle}>
        V-G band (±)
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={value.vg_band}
          onChange={(e) => onChange("vg_band", Math.max(0, Number(e.target.value)))}
          style={inputStyle}
        />
      </label>
    </div>
  );
}
