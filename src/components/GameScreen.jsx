<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/GameStyles.css";

function GameScreen({ lobbyId, leaveGame }) {
  const [buzzer, setBuzzer] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);

  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        setLobbyData(snapshot.data());
      } else {
        setLobbyData(null);
      }
    });

    return () => unsubscribe();
  }, [lobbyId]);

  useEffect(() => {
    if (buzzer) {
      const timer = setTimeout(() => {
        setBuzzer(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [buzzer]);
=======
import React, { useState } from "react";
import "../styles/GameStyles.css";

function GameScreen({ players, host, setPlayers }) {
  const [buzzer, setBuzzer] = useState(null);
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08

  const buzz = (player) => {
    if (!buzzer) {
      setBuzzer(player);
    }
  };

  return (
    <div className="container">
<<<<<<< HEAD
      <h1>🎮 Game On!</h1>
      <h2>Host: {lobbyData?.host || "Unknown"}</h2>

      {buzzer ? (
        <div className="buzzed-message">
          <h2>🚀 {buzzer} buzzed in first!</h2>
        </div>
      ) : (
        <h2>⏳ Waiting for someone to buzz in...</h2>
      )}

      {/* 📟 Remote Control Container */}
      <div className="remote-container">
        <div className="remote">
          {lobbyData?.players && Object.keys(lobbyData.players).length > 0 ? (
            Object.keys(lobbyData.players).map((player) => (
              <button key={player} className="remote-button" onClick={() => buzz(player)}>
                {player}
              </button>
            ))
          ) : (
            <p>No players joined yet.</p>
          )}
        </div>
      </div>

      {buzzer && (
        <button className="clear-buzzer" onClick={() => setBuzzer(null)}>
          🔄 Clear Buzzer
        </button>
      )}

      <button className="leave-game" onClick={leaveGame}>
        🚪 Leave Game
      </button>
=======
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
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
    </div>
  );
}

export default GameScreen;
