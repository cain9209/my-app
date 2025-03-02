import React from "react";

function Lobby({ lobbyId, lobbyData }) {
  return (
    <div className="container">
      <h1>Game Lobby</h1>
      <h2>Lobby ID: {lobbyId}</h2>
      <p>Share this ID with friends!</p>

      <h3>Host: {lobbyData?.host || "Unknown"} (Hosting)</h3>

      <h3>Players Joining:</h3>
      {lobbyData?.players && Object.keys(lobbyData.players).length > 0 ? (
        <ul>
          {Object.keys(lobbyData.players).map((player) => (
            <li key={player}>{player}</li>
          ))}
        </ul>
      ) : (
        <p>No players have joined yet.</p>
      )}
    </div>
  );
}

export default Lobby;
