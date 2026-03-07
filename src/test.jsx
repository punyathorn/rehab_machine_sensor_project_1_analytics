import React, { useState } from "react";

export default function App() {

  const [resistance, setResistance] = useState(10);
  const [mode, setMode] = useState("Normal");
  const [homed, setHomed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------- HOMING ----------
  const handleHome = async () => {

    const confirmHome = window.confirm("Start homing?");
    if (!confirmHome) return;

    setLoading(true);

    try {
      await fetch("/api/home", {
        method: "POST"
      });

      alert("Homing started");

    } catch (err) {
      console.error(err);
      alert("Homing failed");
    }

    setLoading(false);
  };

  const handleHomeDone = async () => {

    try {

      await fetch("/api/home_done", {
        method: "POST"
      });

      setHomed(true);
      alert("Homing completed");

    } catch (err) {
      console.error(err);
    }
  };

  // ---------- RESISTANCE ----------
  const handleSetResistance = async () => {

    const confirmSet = window.confirm(`Set resistance to ${resistance}?`);
    if (!confirmSet) return;

    try {

      await fetch("/api/resistance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resistance })
      });

      alert("Resistance set");

    } catch (err) {
      console.error(err);
      alert("Failed to set resistance");
    }
  };

  // ---------- MODE ----------
  const handleSetMode = async () => {

    const confirmSet = window.confirm(`Set mode to ${mode}?`);
    if (!confirmSet) return;

    try {

      await fetch("/api/mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mode })
      });

      alert("Mode updated");

    } catch (err) {
      console.error(err);
      alert("Failed to update mode");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>Rehab Control Panel</h1>

      {/* ---------- HOMING ---------- */}
      <h2>Homing</h2>

      <button onClick={handleHome} disabled={loading}>
        Start Homing
      </button>

      <button onClick={handleHomeDone}>
        Home Done
      </button>

      <p>Status: {homed ? "Homed" : "Not Homed"}</p>


      {/* ---------- RESISTANCE ---------- */}
      <h2>Resistance</h2>

      <input
        type="number"
        value={resistance}
        disabled={!homed}
        onChange={(e) => setResistance(e.target.value)}
      />

      <button
        onClick={handleSetResistance}
        disabled={!homed}
      >
        Confirm Resistance
      </button>


      {/* ---------- MODE ---------- */}
      <h2>Mode</h2>

      <select
        value={mode}
        disabled={!homed}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="Normal">Normal</option>
        <option value="Auto">Auto</option>
      </select>

      <button
        onClick={handleSetMode}
        disabled={!homed}
      >
        Confirm Mode
      </button>

    </div>
  );
}