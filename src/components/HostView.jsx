import React from "react";

function HostView({ lobbyId, lobbyData, startGame }) {
  return (
    <div className="container">
      <h1>Host Control Panel</h1>
      <h2>Lobby ID: {lobbyId}</h2>
      
      <button onClick={() => navigator.clipboard.writeText(lobbyId)}>
        📋 Copy Lobby ID
      </button>
      <p>Share this ID with players so they can join.</p>

      <h3>Host: {lobbyData?.host || "Unknown"} (Hosting)</h3>

      <h3>Players in Lobby:</h3>
      {lobbyData?.players && lobbyData.players.length > 0 ? (
        <ul>
          {lobbyData.players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      ) : (
        <p>No players have joined yet.</p> // ✅ Message if the lobby is empty
      )}

      {/* ✅ Only show Start Game button if players have joined */}
      {lobbyData?.players?.length > 0 && (
        <button style={{ marginTop: "10px", padding: "10px 15px" }} onClick={startGame}>
          🚀 Start Game
        </button>
      )}
    </div>
  );
}

export default HostView;
