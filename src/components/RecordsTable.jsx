import React from "react";

function formatDuration(s) {
  if (s == null) return "0s";

  const total = Math.round(s);
  const m = Math.floor(total / 60);
  const sec = total % 60;

  return m ? `${m}m ${sec}s` : `${sec}s`;
}

export default function RecordsTable({ recs, setRecs }) {

  function clearAll() {
    if (!window.confirm("Clear all recorded rounds?")) return;
    setRecs([]);
  }

  return (
    <div className="card">

      <div className="card-header">
        <h2>Records</h2>

        <div>
          <button className="btn small" onClick={clearAll}>
            Clear
          </button>
        </div>
      </div>

      {recs.length === 0 ? (
        <p className="empty">No records yet.</p>
      ) : (

        <table className="records-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Mode</th>
              <th>Resistance</th>
              <th>Reps</th>
              <th>Duration</th>
            </tr>
          </thead>

          <tbody>

            {recs.map((r,i) => {

              const date = new Date(r.date);

              return (
                <tr key={r.id ?? i}>

                  <td>
                    {date.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {", "}
                    {date.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>

                  <td className="mono">{r.mode}</td>
                  <td className="mono">{r.resistance}</td>
                  <td className="mono">{r.reps}</td>
                  <td className="mono">{formatDuration(r.duration_sec)}</td>

                </tr>
              );
            })}

          </tbody>

        </table>

      )}

    </div>
  );
}