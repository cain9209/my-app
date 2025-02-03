import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";
import HostView from "./components/HostView";
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

const MainLayout = () => {
  const [lobbyId, setLobbyId] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hostName, setHostName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [lobbyIdInput, setLobbyIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Show Navbar ONLY in the Lobby
  const showNavbar = location.pathname === "/lobby";

  // 🔥 Create a new lobby
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
      players: {},
      gameStarted: false,
    });

    setLobbyId(newLobbyId);
    setIsHost(true);
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

      if (lobbyData.players && lobbyData.players[playerName]) {
        alert("Name already taken! Choose a different name.");
        setLoading(false);
        return;
      }

      const updatedPlayers = {
        ...lobbyData.players,
        [playerName]: 0, // ✅ Ensure XP starts at 0 for new players
      };

      await setDoc(lobbyRef, { players: updatedPlayers }, { merge: true });

      setLobbyId(lobbyIdInput);
      setGameStarted(true);

      // ✅ Redirect player to the Game Screen
      navigate("/game");
    } else {
      alert("Lobby ID not found!");
    }
    setLoading(false);
  };

  // 🔥 Leave the game
  const leaveGame = async () => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();
      const updatedPlayers = { ...lobbyData.players };
      delete updatedPlayers[playerName];

      if (Object.keys(updatedPlayers).length === 0) {
        await setDoc(lobbyRef, { players: {}, gameStarted: false }, { merge: true });
      } else {
        await setDoc(lobbyRef, { players: updatedPlayers }, { merge: true });
      }
    }

    setLobbyId(null);
    setGameStarted(false);
    setIsHost(false);

    // ✅ Redirect back to Lobby after leaving
    navigate("/lobby");
  };

  // 🔥 Listen for real-time updates
  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        setLobbyData(snapshot.data());

        if (snapshot.data().gameStarted) {
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
    await setDoc(lobbyRef, { gameStarted: true }, { merge: true });

    // ✅ Redirect all players to Game Screen
    navigate("/game");
  };

  return (
    <>
      {showNavbar && <Navbar />}

      <div className="app-container">
        {loading && <div className="loading">Loading...</div>}

        {lobbyId ? (
          gameStarted ? (
            <GameScreen lobbyId={lobbyId} leaveGame={leaveGame} />
          ) : isHost ? (
            <HostView lobbyId={lobbyId} lobbyData={lobbyData} startGame={startGame} />
          ) : (
            <GameScreen lobbyId={lobbyId} leaveGame={leaveGame} />
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
    </>
  );
};

export default App;
