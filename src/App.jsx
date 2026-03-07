import React, { useEffect, useState } from "react";
import ResistanceControl from "./components/ResistanceControl";
import RecordsTable from "./components/RecordsTable";
import Summary from "./components/Summary";
import Timer from "./components/Timer";

const STORAGE_KEY = "ft_recs";
const RES_KEY = "ft_resistance";

const FLASK_API = "https://tkikrata.pythonanywhere.com";

const modes = ["Manual", "Auto"];

function loadRecs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecs(recs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recs));
}

export default function App() {

  const [recs, setRecs] = useState(loadRecs);
  const [mode, setMode] = useState(modes[0]);

  const [resistance, setResistance] = useState(() => {
    const v = localStorage.getItem(RES_KEY);
    return v ? Number(v) : 5;
  });

  const [confirmedRes, setConfirmedRes] = useState(null);
  const [confirmedMode, setConfirmedMode] = useState(null);

  const [showHomePopup, setShowHomePopup] = useState(false);
  const [showSessionPopup, setShowSessionPopup] = useState(false);

  useEffect(() => saveRecs(recs), [recs]);
  useEffect(() => localStorage.setItem(RES_KEY, String(resistance)), [resistance]);

  function addRecFromTimer({ mode, durationSec, stoppedAt }) {
    // ✅ only allow recording when confirmed
    if (confirmedRes == null) {
      alert("Please confirm a resistance level before recording.");
      return;
    }

    const newRec = {
      id: Date.now(),
      mode,
      reps: 0,
      rounds: 0,
      resistance: confirmedRes, // ✅ confirmed only
      duration_sec: durationSec,
      date: new Date(stoppedAt).toISOString(),
    };

    setRecs((r) => [newRec, ...r]);
  }

  // RESISTANCE
  async function confirmResistance(val) {
    try {

      await fetch(`${FLASK_API}/resis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resistance: val })
      });

      setConfirmedRes(val);

    } catch {
      alert("Failed to send resistance");
    }
  }

  // SESSION MODE
  async function sendSession() {
    try {

      await fetch(`${FLASK_API}/mode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mode: mode })
      });

      setConfirmedMode(mode);
      setShowSessionPopup(false);

      alert("Workout mode set");

    } catch {
      alert("Failed to set workout mode");
    }
  }

  const [isRunning, setIsRunning] = useState(false);

  async function startSession() {
    const res = await fetch(`${FLASK_API}/start`, { method: "POST" });
    if (res.ok) setIsRunning(true);
  }

  async function stopSession() {
  setIsRunning(false);
  try {
    const res = await fetch(`${FLASK_API}/stop`, { method: "POST" });
    const data = await res.json();
    console.log("Session Data:", data); // Check the structure of the returned data
    // Check if the backend returned an array of records
    if (Array.isArray(data.result)) {
      setRecs((prevRecs) => [...data.result, ...prevRecs]);
    } else if (data.result) {
      setRecs((prevRecs) => [data.result, ...prevRecs]);
    }
  } catch (err) {
    console.error("Error processing session data:", err);
  }
}

  // HOMING
  async function sendHome() {
    try {

      await fetch(`${FLASK_API}/home`, {
        method: "POST"
      });

      alert("Machine homing started");
      setShowHomePopup(false);

    } catch {
      alert("Failed to home machine");
    }
  }

  return (

    <div className="app">

      <header className="header">
        <h1>Droppy</h1>
        <p className="subtitle" style={{ fontStyle: "italic" }}>
          Dashboard for Foot Drop Rehabilitation Machine
        </p>
      </header>

      <main className="container">

        <section className="summary">
          <Summary recs={recs} />
        </section>

        {/* MODE */}

        <section className="mode">

          <div className="card">

            <h2>Workout Mode</h2>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {modes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <button
              className="btn confirm"
              onClick={() => setShowSessionPopup(true)}
            >
              Confirm
            </button>

            {confirmedMode && (
              <p className="confirmed">
                Current Mode: <b>{confirmedMode}</b>
              </p>
            )}

          </div>
        </section>
        <section className="timer">
          <Timer isRunning={isRunning} onStart={startSession} onStop={stopSession} />
        </section>

        {/* RESISTANCE */}

        <section className="controls">

          <ResistanceControl
            value={resistance}
            onChange={setResistance}
            confirmedValue={confirmedRes}
            onConfirm={confirmResistance}
          />

        </section>
        <section className="homing">
           <div className="card">
              <h2>Motor Homing</h2>
                <button className="btn danger"
                        onClick={() => setShowHomePopup(true)}>
              Home Machine
            </button>
            </div>
        </section>
        {/* RECORDS */}

        <section className="recs">
          <RecordsTable
            recs={recs}
            setRecs={setRecs}
          />
        </section>

      </main>

      {/* SESSION CONFIRM POPUP */}

      {showSessionPopup && (

        <div className="modal">

          <div className="modal-box">

            <h2>Confirm Session</h2>

            <p>
              Start session in <b>{mode}</b> mode?
            </p>

            <div className="btn-row">

              <button
                className="btn"
                onClick={() => setShowSessionPopup(false)}
              >
                Cancel
              </button>

              <button
                className="btn confirm"
                onClick={sendSession}
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

      {/* HOMING POPUP */}

      {showHomePopup && (

        <div className="modal">

          <div className="modal-box">

            <h2>Confirm Homing</h2>

            <p>Are you sure you want to home the machine?</p>

            <p style={{ color: "red" }}>
              Ensure the patient's foot is removed.
            </p>

            <div className="btn-row">

              <button
                className="btn"
                onClick={() => setShowHomePopup(false)}
              >
                Cancel
              </button>

              <button
                className="btn danger"
                onClick={sendHome}
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}