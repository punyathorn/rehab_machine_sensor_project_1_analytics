import React from "react";

function dayKey(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const da = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function formatDuration(sec) {
  const total = Math.round(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m} m ${s} s`;
}



export default function Summary({ recs }) {
  const total = recs.length;

  if (total === 0) {
    return (
      <div className="card">
        <h2>Summary</h2>
        <p className="empty">No records yet.</p>
      </div>
    );
  }

  const avgRes =
    recs.reduce((s, r) => s + (Number(r.resistance) || 0), 0) / total;

  const avgDur =
    recs.reduce((s, r) => s + (Number(r.duration_sec) || 0), 0) / total;

  const bestReps = Math.max(...recs.map(r => Number(r.reps) || 0));

  const last = new Date(
    Math.max(...recs.map(r => new Date(r.date).getTime()))
  );

  // streak
  const days = Array.from(new Set(recs.map(r => dayKey(r.date)))).sort();
  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    const a = new Date(days[i]).getTime();
    const b = new Date(days[i - 1]).getTime();
    if ((a - b) === 86400000) streak++;
    else break;
  }

  return (
    <div className="card">
        <h2>Summary</h2>

    <div className="streak">
      <p>🔥 Day Streak: {streak} </p>
    </div>
      

    <div className="summary-grid">
        <Stat label="Sessions" value={total} />
        <Stat label="Avg Resistance" value={avgRes.toFixed(1)} />
        <Stat label="Avg Duration" value={formatDuration(avgDur)} />
        <Stat label="Best Reps" value={bestReps} />
        <Stat label="Last Session" value={last.toLocaleDateString("en-GB", {day: "numeric",month: "short",year: "numeric"})} />
    </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
