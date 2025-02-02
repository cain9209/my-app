import React, { useState, useEffect } from "react";
import "../styles/GameStyles.css";

function GameScreen({ lobbyId, lobbyData, leaveGame }) {
  const [buzzer, setBuzzer] = useState(null);

  useEffect(() => {
    if (buzzer) {
      const timer = setTimeout(() => {
        setBuzzer(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [buzzer]);

  const buzz = (player) => {
    if (!buzzer) {
      setBuzzer(player);
    }
  };

  return (
    <div className="container">
      <h1>Game On!</h1>
      <h2>Host: {lobbyData?.host}</h2>

      {buzzer ? (
        <div>
          <h2>🚀 {buzzer} buzzed in first!</h2>
        </div>
      ) : (
        <h2>⏳ Waiting for someone to buzz in...</h2>
      )}

      <ul>
        {lobbyData?.players && lobbyData.players.length > 0 ? (
          lobbyData.players.map((player, index) => (
            <li key={index}>
              <button onClick={() => buzz(player)}>{player} Buzz</button>
            </li>
          ))
        ) : (
          <p>No players joined yet.</p>
        )}
      </ul>

      {buzzer && (
        <button style={{ marginTop: "10px", padding: "10px 15px" }} onClick={() => setBuzzer(null)}>
          🔄 Clear Buzzer
        </button>
      )}

      {/* 🔥 Leave Game Button */}
      <button
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={leaveGame}
      >
        🚪 Leave Game
      </button>
    </div>
  );
}

export default GameScreen;
