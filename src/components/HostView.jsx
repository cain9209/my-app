import React from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import "../styles/Host.css";

function HostView({ lobbyId, lobbyData, startGame }) {
  const navigate = useNavigate(); // React Router for redirection

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

    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await deleteDoc(lobbyRef); // ❌ Deletes the lobby from Firestore
      navigate.push("/lobby"); // 🔄 Redirects to the main lobby page
    } catch (error) {
      console.error("Error closing the lobby:", error);
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
          {Object.entries(lobbyData.players)
            .sort(([playerA], [playerB]) => playerA.localeCompare(playerB))
            .map(([player, xp]) => (
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
        <button className="host-button" onClick={startGame}>
          🚀 START GAME
        </button>
      )}

      {/* 🔴 Button to leave and shut down the lobby */}
      <button className="host-button leave-button" onClick={handleLeaveAndCloseLobby}>
        ❌ LEAVE & CLOSE LOBBY
      </button>
    </div>
  );
}

export default HostView;
