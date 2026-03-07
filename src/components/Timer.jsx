import React, { useEffect, useState } from "react";

export default function Timer({ isRunning, onStart, onStop }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="card">
      <h2>Session Timer</h2>
      <div className="timer-value" style={{ fontSize: "2rem", margin: "10px" }}>
        {formatTime(seconds)}
      </div>
      <button className={`btn ${isRunning ? "stop" : "confirm"}`} onClick={isRunning ? onStop : onStart}>
        {isRunning ? "Stop Session" : "Start Session"}
      </button>
    </div>
  );
}