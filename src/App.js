import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";
import HostView from "./components/HostView";
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate(); // ✅ Now inside <Router>, so no error

  const [lobbyId, setLobbyId] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hostName, setHostName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [lobbyIdInput, setLobbyIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Create a new lobby (Players as an array)
  const hostLobby = async () => {
    if (!hostName.trim()) {
      alert("Enter a name to host a lobby!");
      return;
    }

    setLoading(true);
    const newLobbyId = uuidv4().slice(0, 6);
    const newLobbyRef = doc(db, "lobbies", newLobbyId);

    await setDoc(newLobbyRef, {
      host: hostName,
      players: [], // ✅ Players stored as an array
      gameStarted: false,
      buzzer: null,
      messages: []
    });

    setLobbyId(newLobbyId);
    setIsHost(true);
    navigate("/host"); // ✅ Redirect host to Host View
    setLoading(false);
  };

  // 🔥 Join an existing lobby
  const joinLobby = async () => {
    if (!lobbyIdInput.trim() || !playerName.trim()) {
      alert("Enter a valid Lobby ID and name!");
      return;
    }

    setLoading(true);
    const lobbyRef = doc(db, "lobbies", lobbyIdInput);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();

      if (Array.isArray(lobbyData.players) && lobbyData.players.includes(playerName)) {
        alert("Name already taken! Choose a different name.");
        setLoading(false);
        return;
      }

      const updatedPlayers = [...(lobbyData.players || []), playerName]; // ✅ Add player to array

      await updateDoc(lobbyRef, { players: updatedPlayers });

      setLobbyId(lobbyIdInput);
      setGameStarted(lobbyData.gameStarted);
      navigate("/game"); // ✅ Redirect player to Game Screen
    } else {
      alert("Lobby ID not found!");
    }
    setLoading(false);
  };

  // 🔥 Leave the game (Remove player from array)
  const leaveGame = async () => {
    if (!lobbyId || !playerName) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();

      if (Array.isArray(lobbyData.players)) {
        const updatedPlayers = lobbyData.players.filter(player => player !== playerName); // ✅ Remove player

        await updateDoc(lobbyRef, { players: updatedPlayers });

        if (updatedPlayers.length === 0) {
          await updateDoc(lobbyRef, { gameStarted: false }); // ✅ Reset game if empty
        }
      }
    }

    setLobbyId(null);
    setGameStarted(false);
    setIsHost(false);
    navigate("/"); // ✅ Redirect player back to home
  };

  // 🔥 Listen for real-time updates
  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLobbyData(data);

        if (data.gameStarted) {
          setGameStarted(true);
        }
      } else {
        console.log("❌ Lobby does not exist!");
        setLobbyData(null);
      }
    });

    return () => unsubscribe();
  }, [lobbyId]);

  // 🔥 Start Game
  const startGame = async () => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    await updateDoc(lobbyRef, { gameStarted: true });
  };

  return (
    <div className="app-container">
      <Navbar />
      {loading && <div className="loading">Loading...</div>}

      {lobbyId ? (
        gameStarted ? (
          <GameScreen lobbyId={lobbyId} lobbyData={lobbyData} leaveGame={leaveGame} />
        ) : isHost ? (
          <HostView lobbyId={lobbyId} lobbyData={lobbyData} startGame={startGame} />
        ) : (
          <GameScreen lobbyId={lobbyId} lobbyData={lobbyData} leaveGame={leaveGame} />
        )
      ) : (
        <div className="lobby-selection">
          <h1>Welcome to the Game!</h1>

          <div className="form-container">
            <h2>Host a Lobby</h2>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Enter your name to Host"
            />
            <button onClick={hostLobby} disabled={loading}>Host a Lobby</button>
          </div>

          <div className="form-container">
            <h2>Join a Lobby</h2>
            <input
              type="text"
              value={lobbyIdInput}
              onChange={(e) => setLobbyIdInput(e.target.value)}
              placeholder="Enter Lobby ID"
            />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter Your Name"
            />
            <button onClick={joinLobby} disabled={loading}>Join Lobby</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppWrapper;
