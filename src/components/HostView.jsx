import React from "react";
<<<<<<< HEAD
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/Host.css";

function HostView({ lobbyId, lobbyData, startGame }) {
  // 🔥 Function to update a player's XP in Firestore
  const updatePoints = async (player, change) => {
    if (!lobbyId || !lobbyData) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const updatedPlayers = { ...lobbyData.players };

    // ✅ Ensure XP is always a number
    updatedPlayers[player] = Math.max(0, (updatedPlayers[player] || 0) + change);

    await updateDoc(lobbyRef, { players: updatedPlayers });
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
=======

function HostView({ lobbyId, lobbyData, startGame }) {
  return (
    <div className="container">
      <h1>Host Control Panel</h1>
      <h2>Lobby ID: {lobbyId}</h2>
      <button onClick={() => navigator.clipboard.writeText(lobbyId)}>Copy Lobby ID</button>
      <p>Share this ID with players!</p>

      <h3>Host: {lobbyData?.host} (Hosting)</h3>

      <h3>Players in Lobby:</h3>
      <ul>
        {lobbyData?.players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>

      {lobbyData?.players.length > 0 && <button onClick={startGame}>Start Game</button>}
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
    </div>
  );
}

export default HostView;
