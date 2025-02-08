import React, { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/Host.css";

function HostView({ lobbyId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lobbyData, setLobbyData] = useState(null);

  // 🔥 Fetch live updates for the lobby
  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        setLobbyData(snapshot.data());
      } else {
        console.log("⚠️ Lobby deleted, redirecting...");
        localStorage.removeItem("lobbyId");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [lobbyId, navigate]);

  // 🏆 Update XP for a player
  const updatePoints = async (player, change) => {
    if (!lobbyId || !lobbyData) return;

    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      const updatedPlayers = { ...lobbyData.players };
      updatedPlayers[player] = Math.max(0, (updatedPlayers[player] || 0) + change);

      await updateDoc(lobbyRef, { players: updatedPlayers });
    } catch (error) {
      console.error("🚨 Error updating XP:", error);
    }
  };

  // 🔥 Start Game
  const startGame = async () => {
    if (!lobbyId) return;

    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, { gameStarted: true });

      console.log("✅ Game started successfully!");
    } catch (error) {
      console.error("🚨 Error starting game:", error);
    }
  };

  // 🔥 Host leaves & closes lobby
  const handleLeaveAndCloseLobby = async () => {
    if (!lobbyId) return;
    setLoading(true);

    try {
      await deleteDoc(doc(db, "lobbies", lobbyId));
      console.log("✅ Lobby deleted!");
      localStorage.removeItem("lobbyId");
      navigate("/");
    } catch (error) {
      console.error("🚨 Error deleting lobby:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="host-container">
      <h1>HOST CONTROL PANEL</h1>
      <h2>LOBBY ID: {lobbyId}</h2>

      <button className="host-button" onClick={() => navigator.clipboard.writeText(lobbyId)}>
        📋 COPY LOBBY ID
      </button>
      <p>SHARE THIS ID WITH PLAYERS TO JOIN.</p>

      <h3>HOST: {lobbyData?.host || "UNKNOWN"} (HOSTING)</h3>

      <h3>PLAYERS IN LOBBY:</h3>
      {lobbyData?.players && Object.keys(lobbyData.players).length > 0 ? (
        <ul className="host-player-list">
          {Object.entries(lobbyData.players).map(([player, xp]) => (
            <li key={player} className="player-item">
              <span className="player-name">{player}: <strong>{xp ?? 0} XP</strong></span>
              
              {/* 🔼 XP Buttons for Host */}
              <div className="points-controls">
                <button className="points-button" onClick={() => updatePoints(player, -1)}>➖</button>
                <button className="points-button" onClick={() => updatePoints(player, 1)}>➕</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-players">NO PLAYERS HAVE JOINED YET.</p>
      )}

      {lobbyData?.players && Object.keys(lobbyData.players).length > 0 && (
        <button className="host-button" onClick={startGame} disabled={loading}>
          🚀 START GAME
        </button>
      )}

      <button className="host-button leave-button" onClick={handleLeaveAndCloseLobby} disabled={loading}>
        {loading ? "Closing..." : "❌ LEAVE & CLOSE LOBBY"}
      </button>
    </div>
  );
}

export default HostView;
