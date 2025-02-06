import React, { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom"; // ✅ Add navigation to redirect players
import "../styles/GameStyles.css";

function GameScreen({ lobbyId, leaveGame }) {
  const [buzzer, setBuzzer] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize navigation

  // 🔥 Fetch real-time updates from Firestore
  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLobbyData(data);

        // ✅ If the host ends the game, send all players back to the lobby
        if (data.gameEnded) {
          navigate(`/lobby/${lobbyId}`); // Redirect back to the lobby
        }
      } else {
        setLobbyData(null);
      }
    });

    return () => unsubscribe();
  }, [lobbyId, navigate]);

  // 🔥 Reset buzzer after 5 seconds
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

  // 🔥 Handle host ending the game
  const endGame = async () => {
    if (!lobbyData?.host) return;
    
    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, {
        gameEnded: true, // Mark the game as ended in Firestore
      });

      navigate(`/lobby/${lobbyId}`); // Redirect immediately
    } catch (error) {
      console.error("Error ending game:", error);
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
                {player} Buzz
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

      {/* ✅ Show "End Game" button for the host */}
      {lobbyData?.host && (
        <button className="end-game" onClick={endGame} style={{ background: "red", color: "white" }}>
          🛑 End Game
        </button>
      )}
    </div>
  );
}

export default GameScreen;
