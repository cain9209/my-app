import React, { useState, useEffect } from "react";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";
import HostView from "./components/HostView";
import { db } from "./firebaseConfig";
import { collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [lobbyId, setLobbyId] = useState(null);
  const [lobbyData, setLobbyData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hostName, setHostName] = useState(""); 
  const [playerName, setPlayerName] = useState(""); 
  const [lobbyIdInput, setLobbyIdInput] = useState(""); 

  // 🔥 Create a new lobby in Firestore
  const hostLobby = async () => {
    if (!hostName.trim()) {
      alert("Enter a name to host a lobby!");
      return;
    }

    const newLobbyId = uuidv4().slice(0, 6);
    const newLobbyRef = doc(db, "lobbies", newLobbyId);

    await setDoc(newLobbyRef, {
      host: hostName,
      players: [],
      gameStarted: false
    });

    setLobbyId(newLobbyId);
    setIsHost(true);
  };

  // 🔥 Join an existing lobby & add player
  const joinLobby = async () => {
    if (!lobbyIdInput.trim() || !playerName.trim()) {
      alert("Enter a valid Lobby ID and name!");
      return;
    }

    const lobbyRef = doc(db, "lobbies", lobbyIdInput);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();
      const updatedPlayers = [...lobbyData.players, playerName]; 

      await setDoc(lobbyRef, { players: updatedPlayers }, { merge: true }); // ✅ Prevents overwriting
      setLobbyId(lobbyIdInput);
    } else {
      alert("Lobby ID not found!");
    }
  };

  // 🔥 Listen for real-time lobby updates
  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        setLobbyData(snapshot.data());
        console.log("🔥 Lobby Data Updated:", snapshot.data());
      } else {
        console.log("❌ Lobby does not exist!");
        setLobbyData(null);
      }
    });

    return () => unsubscribe();
  }, [lobbyId]);

  // 🔥 Start Game (Update Firestore without overwriting existing data)
  const startGame = async () => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    await setDoc(lobbyRef, { gameStarted: true }, { merge: true });
  };

  return (
    <div>
      {lobbyId ? (
        gameStarted ? (
          <GameScreen lobbyId={lobbyId} lobbyData={lobbyData} />
        ) : isHost ? (
          <HostView lobbyId={lobbyId} lobbyData={lobbyData} startGame={startGame} />
        ) : (
          <Lobby lobbyId={lobbyId} lobbyData={lobbyData} />
        )
      ) : (
        <div>
          <h1>Welcome to the Game!</h1>
          
          {/* Host a Lobby */}
          <input 
            type="text" 
            value={hostName} 
            onChange={(e) => setHostName(e.target.value)} 
            placeholder="Enter your name to Host" 
          />
          <button onClick={hostLobby}>Host a Lobby</button>

          <br />

          {/* Join an Existing Lobby */}
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

          <button onClick={joinLobby}>Join Lobby</button>
        </div>
      )}
    </div>
  );
}

export default App;
