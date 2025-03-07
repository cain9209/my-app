import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import GameScreen from "./components/GameScreen";
import HostView from "./components/HostView";
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "./styles/Lobby.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Detects current URL
  const safeNavigate = useCallback((path) => navigate(path), [navigate]);

  // ✅ Load values from Local Storage on refresh
  const [lobbyId, setLobbyId] = useState(localStorage.getItem("lobbyId") || null);
  const [playerName, setPlayerName] = useState(localStorage.getItem("playerName") || "");
  const [lobbyData, setLobbyData] = useState(null);
  const [isHost, setIsHost] = useState(localStorage.getItem("isHost") === "true");
  const [gameStarted, setGameStarted] = useState(false); // 🔥 Load from Firestore, NOT localStorage!
  const [hostName, setHostName] = useState("");
  const [lobbyIdInput, setLobbyIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto-save player name to Local Storage
  useEffect(() => {
    if (playerName) {
      localStorage.setItem("playerName", playerName);
    }
  }, [playerName]);

  // 🔥 Host a new lobby
  const hostLobby = async () => {
    if (!hostName.trim()) {
      alert("⚠️ Enter a name to host a lobby!");
      return;
    }

    setLoading(true);
    const newLobbyId = uuidv4().slice(0, 6);
    const newLobbyRef = doc(db, "lobbies", newLobbyId);

    await setDoc(newLobbyRef, {
      host: hostName,
      players: {}, // ✅ Start with an empty player list (DO NOT add the host)
      gameStarted: false,
      buzzer: null,
      messages: [],
    });
    

    setLobbyId(newLobbyId);
    setPlayerName(hostName);
    localStorage.setItem("lobbyId", newLobbyId);
    localStorage.setItem("isHost", "true");
    setIsHost(true);
    safeNavigate(`/host/${newLobbyId}`);
    setLoading(false);
  };

  // 🔥 Join an existing lobby
  const joinLobby = async () => {
    if (!lobbyIdInput.trim() || !playerName.trim()) {
      alert("⚠️ Enter a valid Lobby ID and name!");
      return;
    }

    setLoading(true);
    const lobbyRef = doc(db, "lobbies", lobbyIdInput);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();

      if (lobbyData.players?.[playerName]) {
        alert("⚠️ Name already taken! Choose a different name.");
        setLoading(false);
        return;
      }

      const updatedPlayers = { ...(lobbyData.players || {}), [playerName]: 0 };
      await updateDoc(lobbyRef, { players: updatedPlayers });

      setLobbyId(lobbyIdInput);
      localStorage.setItem("lobbyId", lobbyIdInput);
      localStorage.setItem("isHost", "false");
      setGameStarted(lobbyData.gameStarted);
      setIsHost(false);
      safeNavigate(`/game/${lobbyIdInput}`);
    } else {
      alert("❌ Lobby ID not found!");
    }
    setLoading(false);
  };

  // 🔥 Listen for real-time updates (Firestore)
  // 🔥 Listen for real-time updates (Firestore)
useEffect(() => {
  if (!lobbyId) return;

  console.log("📡 Listening to Firestore for lobby:", lobbyId);
  const lobbyRef = doc(db, "lobbies", lobbyId);

  const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      setLobbyData(data);
      setGameStarted(data.gameStarted);

      // ✅ Store values in Local Storage to persist after refresh
      localStorage.setItem("gameStarted", data.gameStarted ? "true" : "false");

      // 🔥 Only move players to game screen, NOT the host!
      if (data.gameStarted && !isHost && location.pathname !== `/game/${lobbyId}`) {
        console.log("🚀 Game started, navigating to game screen...");
        safeNavigate(`/game/${lobbyId}`);
      }

      // ✅ If host, make sure they stay on the host page
      if (isHost && location.pathname !== `/host/${lobbyId}`) {
        console.log("🏠 Host detected, keeping them on the host screen.");
        safeNavigate(`/host/${lobbyId}`);
      }
    } else {
      console.error("❌ Lobby does not exist! Resetting state...");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameStarted");
      localStorage.removeItem("isHost");
      setLobbyData(null);
      setLobbyId(null);
      safeNavigate("/");
    }
  });

  return () => unsubscribe();
}, [lobbyId, isHost, location.pathname, safeNavigate]);

  return (
    <>
      <Navbar />
      <div className="app-container">
        {loading && <div className="loading">⏳ Loading...</div>}

        <Routes>
          {/* ✅ Fixed lobby selection UI */}
          <Route path="/" element={
            <div className="lobby-selection">
              <h1>   Welcome to the Game!</h1>

              {/* 🔹 Host a Lobby */}
              <div className="form-container">
                <h2>🏠 Host a Lobby</h2>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Enter your name to Host"
                />
                <button onClick={hostLobby} disabled={loading}>Host a Lobby</button>
              </div>

              {/* 🔹 Join a Lobby */}
              <div className="form-container">
                <h2>🔗 Join a Lobby</h2>
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
          } />

          {/* ✅ Host View Route */}
          <Route path="/host/:lobbyId" element={
            isHost ? <HostView lobbyId={lobbyId} lobbyData={lobbyData} /> : <h2>🚫 Unauthorized</h2>
          } />

          {/* ✅ Game Screen Route (Handles Refresh Issues) */}
          <Route path="/game/:lobbyId" element={
            gameStarted ? (
              <GameScreen lobbyId={lobbyId} playerName={playerName} lobbyData={lobbyData} />
            ) : (
              <h2>⏳ Waiting for Host...</h2>
            )
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
