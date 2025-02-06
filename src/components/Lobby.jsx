import React, { useState } from "react";

function Lobby({ handleHostLobby, handleJoinLobby }) {
  const [name, setName] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="your-logo.png" alt="Logo" />
          <a href="/">Intelligence Check</a>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰ Menu</button>
        <ul className={`nav-links ${menuOpen ? "show-menu" : ""}`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Song Request</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Submission Form */}
      <div className="container">
        <div className="card">
          <h2>Join or Host a Lobby</h2>
          <p>Enter your details below to create or join a game.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (lobbyId) {
                handleJoinLobby(lobbyId, name); 
              } else {
                handleHostLobby(name);
              }
            }}
          >
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Enter Lobby ID (Leave empty to host)"
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
            />

            <button type="submit">
              {lobbyId ? "Join Lobby" : "Host a Lobby"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
