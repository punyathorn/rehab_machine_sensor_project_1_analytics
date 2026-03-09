import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AngleChart({ recs }) {

  const start = recs.length ? new Date(recs[0].date).getTime() : 0;

  const data = recs.map((r, index) => {
    const now = new Date(r.date).getTime();

    return {
      angle: r.angle,
      resistance: r.resistance,
      time_sec: (now - start) / 1000,
      absoluteTime: new Date(r.date).toLocaleTimeString(),
      dataPoint: index + 1
    };
  });

  const maxTime = data.length ? data[data.length - 1].time_sec : 0;
  const dynamicTickCount = Math.max(5, Math.floor(maxTime / 10));
  return (
    <div className="chart-box">
      <h2>Angle vs Time</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          
          <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />

          <XAxis
            type="number"
            dataKey="time_sec"
            tick={{ fontSize: 11 }}
            interval={0}
            tickCount={dynamicTickCount}
            domain={[0, maxTime]}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickCount={8}
          />

          <Tooltip
            formatter={(value, name) => {
                if (name === "angle") return [`${value.toFixed(2)} °`, "Angle"];
                if (name === "resistance") return [value, "Resistance"];
            }}
            labelFormatter={(value) => {
            const point = data.reduce((prev, curr) => 
                Math.abs(curr.time_sec - value) < Math.abs(prev.time_sec - value) ? curr : prev
            );
            return `Point #${point.dataPoint} | ${point.absoluteTime}`;
            }}
            />

          <Line
            type="linear"
            dataKey="angle"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="linear"
            dataKey="resistance"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}