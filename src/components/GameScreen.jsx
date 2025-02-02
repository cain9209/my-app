import React, { useState, useEffect } from "react";
import "../styles/GameStyles.css";

function GameScreen({ players = [], host, setPlayers }) {
  const [buzzer, setBuzzer] = useState(null);

  // 🔥 Auto-reset buzzer after 5 seconds
  useEffect(() => {
    if (buzzer) {
      const timer = setTimeout(() => {
        setBuzzer(null);
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [buzzer]);

  const buzz = (player) => {
    if (!buzzer) {
      setBuzzer(player);
    }
  };

  const resetBuzzer = () => {
    setBuzzer(null);
  };

  return (
    <div className="container">
      <h1>Game On!</h1>
      <h2>Host: {host}</h2>

      {buzzer ? (
        <div>
          <h2>🚀 {buzzer} buzzed in first!</h2>
        </div>
      ) : (
        <h2>⏳ Waiting for someone to buzz in...</h2>
      )}

      <ul>
        {players.length > 0 ? (
          players.map((player, index) => (
            <li key={index}>
              <button onClick={() => buzz(player)}>{player} Buzz</button>
            </li>
          ))
        ) : (
          <p>No players joined yet.</p> // ✅ Prevents crash if players array is empty
        )}
      </ul>

      {/* ✅ Host can reset buzzer */}
      {buzzer && (
        <button style={{ marginTop: "10px", padding: "10px 15px" }} onClick={resetBuzzer}>
          🔄 Clear Buzzer
        </button>
      )}
    </div>
  );
}

export default GameScreen;
