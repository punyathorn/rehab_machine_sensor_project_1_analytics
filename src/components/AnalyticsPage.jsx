import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { data: dbData } = await supabase
        .from("rehab_sessions")
        .select("duration_sec, resistance");
      setData(dbData || []);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  const count = data.length;
  const avgRes = count ? (data.reduce((acc, r) => acc + (Number(r.resistance) || 0), 0) / count).toFixed(1) : 0;
  const maxRes = count ? Math.max(...data.map(r => Number(r.resistance) || 0)) : 0;
  const avgDur = count ? (data.reduce((acc, r) => acc + (Number(r.duration_sec) || 0), 0) / count).toFixed(0) : 0;

  return (
    <div className="card">
      <h2>Global Statistics</h2>
      <div className="stats-grid">
        <p>Total Sessions: <b>{count}</b></p>
        <p>Average Resistance: <b>{avgRes} kg</b></p>
        <p>Max Resistance: <b>{maxRes} kg</b></p>
        <p>Average Duration: <b>{avgDur} s</b></p>
      </div>
    </div>
  );
}