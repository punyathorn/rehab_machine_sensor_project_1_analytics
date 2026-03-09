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

const quotes = [
  "67% effort today > 0% yesterday.",
  "Bro did 3 reps and called it character development.",
  "If reps were free, why you still broke?",
  "0 reps detected. Motivation.exe not found.",
  "Gym arc loading… 12% complete.",
  "One more rep = +1 aura.",
  "Skipping workout? That’s a -10 discipline debuff.",
  "You: 0 - Droppy: 100. Ouch.",
  "Bro opened the gym app. That’s already +5 XP.",
  "No reps? NPC behavior.",
  "Bro opened the app. That's already +5 XP.",
  "One more rep = +1 aura.",
  "Locked in. 67% discipline. 33% delusion.",
  "Gym arc. No refunds.",
  "One rep today, stronger tomorrow. Keep going.",
  "Just one more rep. Your future ankle said thanks.",
  "No reps? No progress. Do the reps. Become unstoppable.",
  "Every rep upgrades your firmware.",
  "Small reps. Big comeback.",
  "Lock in. One more rep. The ankle arc begins.",
  "Small reps today. Big steps tomorrow.",
  "One more rep. Future you will thank you.",
  "Lock in. The ankle arc begins.",
  "Reps today, stronger tomorrow.",
  "No reps? No progress.",
  "Every rep upgrades your firmware.",
  "Pain is temporary. Strong ankles are forever.",
  "Keep going. Your future walk depends on it.",
  "Just one more rep. Trust the process.",
  "Consistency beats intensity."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default function Summary({ recs }) {

  const total = recs.length;
  const [quote] = React.useState(getRandomQuote);

  if (total === 0) {
    return (
      <div className="card">
        <h2>Summary</h2>

        <div className="streak">
          <p className="quote">"{quote}"</p>
        </div>

        <p className="empty">No records yet.</p>
      </div>
    );
  }

  const start = new Date(recs[0].date);
  const end = new Date(recs[recs.length - 1].date);

  const durationSec = (end - start) / 1000;

  const maxAngle = Math.max(...recs.map(r => Number(r.angle) || 0));

  const avgRes =
    recs.reduce((s, r) => s + (Number(r.resistance) || 0), 0) / recs.length;

  // session start & end times
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
        <p className="quote">"{quote}"</p>
      </div>

      <div className="summary-grid">

        <Stat label="Samples" value={recs.length} />

        <Stat label="Avg Resistance" value={avgRes.toFixed(1)} />

        <Stat label="Max Angle" value={maxAngle.toFixed(1) + "°"} />

        <Stat label="Session Start" value={start.toLocaleTimeString()} />

        <Stat label="Session End" value={end.toLocaleTimeString()} />

        <Stat label="Session Duration" value={formatDuration(durationSec)} />

        <Stat
          label="Last Session"
          value={end.toLocaleString("en-GB")}
        />

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
