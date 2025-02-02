import React from "react";

function Lobby({ lobbyId, lobbyData }) {
  return (
    <div className="container">
      <h1>Game Lobby</h1>
      <h2>Lobby ID: {lobbyId}</h2>
      <p>Share this ID with friends!</p>

      <h3>Host: {lobbyData?.host || "Unknown"} (Hosting)</h3>

      <h3>Players Joining:</h3>
      <ul>
        {lobbyData?.players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
