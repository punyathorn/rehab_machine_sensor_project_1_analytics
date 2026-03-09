import React, { useEffect, useState } from "react";
import Summary from "./components/Summary";
import { supabase } from "./supabaseClient";
import AngleChart from "./components/AngleChart";
import AngleTable from "./components/AngleTable";

export default function App() {

  const [recs, setRecs] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);

  // fetch all available session IDs
  async function fetchSessions() {
    const { data, error } = await supabase
      .from("session_data")
      .select("session_id")
      .not("session_id", "is", null)
      .order("session_id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const uniqueSessions = [...new Set(data.map(r => r.session_id))];
    setSessions(uniqueSessions);

    if (uniqueSessions.length && sessionId === null) {
      setSessionId(uniqueSessions[0]); // latest session
    }
  }

  // fetch rows for a specific session
  async function fetchSessionData(session) {
    const { data, error } = await supabase
      .from("session_data")
      .select("*")
      .eq("session_id", session)
      .order("date", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }
    console.log("Fetched session data:", data);
    setRecs(data || []);
  }

  // load sessions when app starts
  useEffect(() => {
    fetchSessions();
  }, []);

  // reload data when session changes
  useEffect(() => {
    if (sessionId !== null) {
      fetchSessionData(sessionId);
    }
  }, [sessionId]);

  return (
    <div className="app">

      <header className="header">
        <h1>Droppy</h1>
        <p className="subtitle">
          Dashboard for Foot Drop Rehabilitation Machine
        </p>

        {/* session selector */}
        <div className="session-select">
          <label>Session:</label>

          <select
            value={sessionId || ""}
            onChange={(e) => setSessionId(Number(e.target.value))}
          >
            {sessions.map(id => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

      </header>

      <main className="container">

        <div className="card">
          <Summary recs={recs} />
        </div>

        <div className="card">
          <AngleChart recs={recs} />
        </div>

        <div className="card">
          <AngleTable recs={recs} />
        </div>

      </main>

    </div>
  );
}