import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/GameStyles.css";

function GameScreen({ lobbyId, leaveGame }) {
  const [buzzer, setBuzzer] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);

  // 🔥 Listen for real-time updates on the lobby
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

  // 🔥 Automatically clear buzzer after 5 seconds
  useEffect(() => {
    if (buzzer) {
      const timer = setTimeout(() => {
        setBuzzer(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [buzzer]);

  // 🔥 Handle player buzzing in
  const buzz = (player) => {
    if (!buzzer) {
      setBuzzer(player);
    }
  };

  return (
    <div className="container">
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
    </div>
  );
}

export default GameScreen;
