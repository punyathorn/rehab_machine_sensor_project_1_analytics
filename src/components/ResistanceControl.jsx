// ResistanceControl.jsx
import React from "react";

export default function ResistanceControl({ value, onChange, confirmedValue, onConfirm }) {
  const isConfirmed = confirmedValue !== null;

  return (
    <div className="card">
      <h2>Machine Resistance</h2>

      <p className="normal_text">
        Current Resistance level: {isConfirmed ? confirmedValue : "-"}
        {isConfirmed && <span className="tick"> ✅</span>}
      </p>

      <p className="hint">
        Set the resistance on the physical machine from here (0 - 10).
      </p>

      <div className="res-control">
        <input
          type="range"
          className="res-slider"
          value={value}
          min={0}
          max={10}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="res-value">{value}</div>
      </div>

      <div className="btn-row">
        <button
          className="btn confirm"
          onClick={() => onConfirm(value)}
          disabled={confirmedValue === value}
        >
          {confirmedValue === value ? "Confirmed" : "Confirm"}
        </button>
      </div>
    </div>
  );
}
