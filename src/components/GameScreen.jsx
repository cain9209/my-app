import React, { useState } from "react";
import "../styles/GameStyles.css";

function GameScreen({ players, host, setPlayers }) {
  const [buzzer, setBuzzer] = useState(null);

  const buzz = (player) => {
    if (!buzzer) {
      setBuzzer(player);
    }
  };

  return (
    <div className="container">
      <h1>Game On!</h1>
      <h2>Host: {host}</h2>

      {buzzer ? (
        <div>
          <h2>{buzzer} buzzed in first!</h2>
        </div>
      ) : (
        <h2>Waiting for someone to buzz in...</h2>
      )}

      <ul>
        {players.map((player, index) => (
          <li key={index}>
            <button onClick={() => buzz(player)}>{player} Buzz</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameScreen;
