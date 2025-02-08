import React, { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/GameStyles.css";

function GameScreen({ lobbyId, playerName }) {
  const [lobbyData, setLobbyData] = useState(null);
  const navigate = useNavigate();

  // 🔥 Fetch live updates from Firestore
  useEffect(() => {
    if (!lobbyId) return;
  
    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLobbyData(data);
  
        // ✅ If game has ended, redirect players back
        if (data.gameEnded) {
          console.warn("⚠️ Game ended! Redirecting players...");
          navigate(`/lobby/${lobbyId}`);
        }
      } else {
        console.error("❌ Lobby does not exist!");
        localStorage.removeItem("lobbyId");
        navigate("/");
      }
    });
  
    return () => unsubscribe();
  }, [lobbyId, navigate]);
  

  // 🔔 Player Buzzes In
  const buzz = async () => {
    console.log("Attempting to buzz in...");
    console.log("lobbyId:", lobbyId);
    console.log("playerName:", playerName);
    console.log("Current buzzer:", lobbyData?.buzzer);
  
    if (!lobbyId || !playerName || lobbyData?.buzzer) {
      console.warn("⚠️ Buzzer is disabled! Conditions not met.");
      return;
    }
  
    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, { buzzer: playerName });
      console.log("✅ Successfully buzzed in!");
    } catch (error) {
      console.error("🚨 Error updating buzzer:", error);
    }
  };
  

  // 🔄 Clear Buzzer (Host Only)
  const clearBuzzer = async () => {
    if (lobbyData?.host !== playerName) return;

    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, { buzzer: null });
    } catch (error) {
      console.error("🚨 Error clearing buzzer:", error);
    }
  };

  // 🔼 XP Adjustment (Host Only)
  const updatePoints = async (player, change) => {
    if (lobbyData?.host !== playerName) return;

    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      const updatedPlayers = { ...lobbyData.players };
      updatedPlayers[player] = Math.max(0, (updatedPlayers[player] || 0) + change);

      await updateDoc(lobbyRef, { players: updatedPlayers });
    } catch (error) {
      console.error("🚨 Error updating XP:", error);
    }
  };

  // 🔥 End Game (Host Only)
  const endGame = async () => {
    if (lobbyData?.host !== playerName) return;

    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, { gameEnded: true });

      navigate("/");
    } catch (error) {
      console.error("🚨 Error ending game:", error);
    }
  };

  return (
    <div className="container">
      <h1>🎮 Game On!</h1>
      <h2>Host: {lobbyData?.host || "Unknown"}</h2>

      {/* 📢 Show Who Buzzed In */}
      {lobbyData?.buzzer ? (
        <div className="buzzed-message">
          <h2>🚀 {lobbyData.buzzer} buzzed in first!</h2>
        </div>
      ) : (
        <h2>⏳ Waiting for someone to buzz in...</h2>
      )}

      {/* 📊 Player XP Board */}
      <div className="xp-container">
        <h3>📊 Player XP</h3>
        {lobbyData?.players && Object.keys(lobbyData.players).length > 0 ? (
          <ul className="xp-list">
            {Object.entries(lobbyData.players).map(([player, xp]) => (
              <li key={player} className="xp-item">
                <span>{player}: <strong>{xp ?? 0} XP</strong></span>
                
                {/* 🔼 XP Buttons (Only Host Sees This) */}
                {lobbyData?.host === playerName && (
                  <div className="points-controls">
                    <button className="points-button" onClick={() => updatePoints(player, -1)}>➖</button>
                    <button className="points-button" onClick={() => updatePoints(player, 1)}>➕</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No players joined yet.</p>
        )}
      </div>

      {/* 🔘 Player Buzz Button */}
      <button className="remote-button" onClick={buzz} disabled={!!lobbyData?.buzzer}>
        🔔 Buzz In
      </button>

      {/* 🔄 Clear Buzzer (Only Host) */}
      {lobbyData?.host === playerName && (
        <button className="clear-buzzer" onClick={clearBuzzer}>
          🔄 Clear Buzzer
        </button>
      )}

      {/* 🛑 End Game (Only Host) */}
      {lobbyData?.host === playerName && (
        <button className="end-game" onClick={endGame} style={{ background: "red", color: "white" }}>
          🛑 End Game
        </button>
      )}
    </div>
  );
}

export default GameScreen;
