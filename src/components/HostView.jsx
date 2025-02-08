import React, { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import "../styles/Host.css";

function HostView({ lobbyId, lobbyData, startGame }) {
  const navigate = useNavigate(); // React Router for redirection
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lobbyId) return;
    
    const lobbyRef = doc(db, "lobbies", lobbyId);
    
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("⚠️ Lobby has been deleted! Redirecting...");
        localStorage.removeItem("lobbyId");
        localStorage.removeItem("lobbyData");
        navigate("/lobby");
      }
    });

    return () => unsubscribe();
  }, [lobbyId, navigate]);

  // 🔥 Function to update player XP in Firestore
  const updatePoints = async (player, change) => {
    if (!lobbyId || !lobbyData) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const updatedPlayers = { ...lobbyData.players };

    // ✅ Ensure XP is always a number
    updatedPlayers[player] = Math.max(0, (updatedPlayers[player] || 0) + change);

    await updateDoc(lobbyRef, { players: updatedPlayers });
  };

  // 🔥 Function to delete the lobby when the host leaves
  const handleLeaveAndCloseLobby = async () => {
    if (!lobbyId) return;
  
    setLoading(true);

    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await deleteDoc(lobbyRef); // ✅ Delete lobby from Firestore

      console.log("✅ Lobby deleted successfully!");

      // ✅ Clear localStorage
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("lobbyData");

      navigate("/lobby"); // ✅ Redirect AFTER deletion
    } catch (error) {
      console.error("🚨 Error closing the lobby:", error);
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
              <span className="player-name">{player}</span>
              <div className="points-controls">
                <button className="points-button" onClick={() => updatePoints(player, -1)}>➖</button>
                <span className="player-points">{xp ?? 0} XP</span>
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

      {/* 🔴 Button to leave and shut down the lobby */}
      <button className="host-button leave-button" onClick={handleLeaveAndCloseLobby} disabled={loading}>
        {loading ? "Closing..." : "❌ LEAVE & CLOSE LOBBY"}
      </button>
    </div>
  );
}

export default HostView;
