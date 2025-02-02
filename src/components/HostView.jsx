import React from "react";

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
    </div>
  );
}

export default HostView;
