import React from "react";

export default function AngleTable({ recs }) {

  if (!recs || recs.length === 0) {
    return <div>No data</div>;
  }

  const start = new Date(recs[0].date).getTime();

  return (
    <div className="table-box">

      <h2>Session Data</h2>

      <table>

        <thead>
          <tr>
            <th>Time (s)</th>
            <th>Angle (°)</th>
            <th>Resistance</th>
            <th>Mode</th>
          </tr>
        </thead>

        <tbody>

          {recs.slice(-80).map((r, i) => {

            const t = (new Date(r.date).getTime() - start) / 1000;

            return (
              <tr key={i}>
                <td>{t.toFixed(2)}</td>
                <td>{Number(r.angle).toFixed(2)}</td>
                <td>{r.resistance}</td>
                <td>{r.mode}</td>
              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}
