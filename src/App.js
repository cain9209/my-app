import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import Navbar from "./components/NavBar";
import GameScreen from "./components/GameScreen";
import HostView from "./components/HostView";
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const navigate = useNavigate(); // ✅ useNavigate imported correctly
  const safeNavigate = useCallback((path) => navigate(path), [navigate]); // ✅ Prevents unnecessary re-renders

  const [lobbyId, setLobbyId] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hostName, setHostName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [lobbyIdInput, setLobbyIdInput] = useState("");
  const [loading, setLoading] = useState(false);

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
      buzzer: null,
      messages: [],
    });

    setLobbyId(newLobbyId);
    setIsHost(true);
    safeNavigate("/host");
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
        ...(lobbyData.players || {}),
        [playerName]: 0,
      };

      await updateDoc(lobbyRef, { players: updatedPlayers });

      setLobbyId(lobbyIdInput);
      setGameStarted(lobbyData.gameStarted);
      setIsHost(false);
      safeNavigate("/game");
    } else {
      alert("Lobby ID not found!");
    }
    setLoading(false);
  };

  // 🔥 Leave the game
  const leaveGame = async () => {
    if (!lobbyId || !playerName) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();

      if (lobbyData.players && typeof lobbyData.players === "object") {
        const updatedPlayers = { ...lobbyData.players };
        delete updatedPlayers[playerName];

        await updateDoc(lobbyRef, { players: updatedPlayers });

        if (Object.keys(updatedPlayers).length === 0) {
          await updateDoc(lobbyRef, { gameStarted: false });
        }
      }
    }

    setLobbyId(null);
    setGameStarted(false);
    setIsHost(false);
    safeNavigate("/");
  };

  // 🔥 Listen for real-time updates (Firestore)
  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLobbyData(data);
        setGameStarted(data.gameStarted);

        if (data.gameStarted && !isHost) {
          safeNavigate("/game");
        }
      } else {
        console.log("❌ Lobby does not exist!");
        setLobbyData(null);
      }
    });

    return () => unsubscribe();
  }, [lobbyId, isHost, safeNavigate]); // ✅ Fixed dependency warning

  // 🔥 Start the game
  const startGame = async () => {
    if (!lobbyId) return;
    const lobbyRef = doc(db, "lobbies", lobbyId);
    await updateDoc(lobbyRef, { gameStarted: true });
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        {loading && <div className="loading">Loading...</div>}

        {lobbyId ? (
          isHost ? (
            <HostView lobbyId={lobbyId} lobbyData={lobbyData} startGame={startGame} />
          ) : gameStarted ? (
            <GameScreen lobbyId={lobbyId} lobbyData={lobbyData} leaveGame={leaveGame} />
          ) : (
            <div className="waiting-room">
              <h2>Waiting for the host to start...</h2>
            </div>
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
}

export default App;
