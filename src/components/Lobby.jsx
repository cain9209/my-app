import React from "react";

function Lobby({ lobbyId, lobbyData }) {
  return (
    <div className="container">
      <h1>Game Lobby</h1>
      <h2>Lobby ID: {lobbyId}</h2>
      <p>Share this ID with friends!</p>

      <h3>Host: {lobbyData?.host || "Unknown"} (Hosting)</h3>

      <h3>Players Joining:</h3>
<<<<<<< HEAD
      {lobbyData?.players && lobbyData.players.length > 0 ? (
        <ul>
          {lobbyData.players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      ) : (
        <p>No players have joined yet.</p>
      )}
=======
      <ul>
        {lobbyData?.players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
>>>>>>> 2fdd0b18e5b32b9cb680ebc3af13c8f9e7291d08
    </div>
  );
}

export default Lobby;
