import React, { useState } from "react";
import "../styles/Lobby.css";

function Lobby({ handleHostLobby, handleJoinLobby }) {
  const [name, setName] = useState("");
  const [lobbyId, setLobbyId] = useState("");

  return (
    <div className="form-container">
      <h2>Welcome to the Game!</h2>

      {/* Host a Lobby */}
      <h3>Host a Lobby</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleHostLobby(name);
        }}
      >
        <input
          type="text"
          placeholder="Enter your name to Host"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Host a Lobby</button>
      </form>

      {/* Join a Lobby */}
      <h3>Join a Lobby</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleJoinLobby(lobbyId, name);
        }}
      >
        <input
          type="text"
          placeholder="Enter Lobby ID"
          value={lobbyId}
          onChange={(e) => setLobbyId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Join Lobby</button>
      </form>
    </div>
  );
}

export default Lobby;
