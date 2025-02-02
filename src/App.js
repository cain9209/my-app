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

  // 🔥 Join an existing lobby & automatically move to game
  const joinLobby = async () => {
    if (!lobbyIdInput.trim() || !playerName.trim()) {
      alert("Enter a valid Lobby ID and name!");
      return;
    }

    const lobbyRef = doc(db, "lobbies", lobbyIdInput);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();
      
      // Prevent duplicate player names
      if (lobbyData.players.includes(playerName)) {
        alert("Name already taken! Choose a different name.");
        return;
      }

      const updatedPlayers = [...lobbyData.players, playerName];

      await setDoc(lobbyRef, { players: updatedPlayers }, { merge: true });

      // ✅ Move player to the game screen immediately
      setLobbyId(lobbyIdInput);
      setGameStarted(true);
    } else {
      alert("Lobby ID not found!");
    }
  };

  // 🔥 Leave Game and return to the main menu
  const leaveGame = async () => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbySnap = await getDoc(lobbyRef);

    if (lobbySnap.exists()) {
      const lobbyData = lobbySnap.data();
      const updatedPlayers = lobbyData.players.filter((player) => player !== playerName);

      if (updatedPlayers.length === 0) {
        // If no players remain, reset the lobby (only if not the host)
        await setDoc(lobbyRef, { players: [], gameStarted: false }, { merge: true });
      } else {
        await setDoc(lobbyRef, { players: updatedPlayers }, { merge: true });
      }
    }

    // Reset the state to return to the main menu
    setLobbyId(null);
    setGameStarted(false);
    setIsHost(false);
  };

  // 🔥 Listen for real-time lobby updates
  useEffect(() => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLobbyData(data);

        // ✅ Move players to GameScreen when host starts the game
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

  // 🔥 Start Game (updates Firestore)
  const startGame = async () => {
    if (!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    await setDoc(lobbyRef, { gameStarted: true }, { merge: true });
  };

  return (
    <div>
      {lobbyId ? (
        gameStarted ? (
          <GameScreen lobbyId={lobbyId} lobbyData={lobbyData} leaveGame={leaveGame} />
        ) : isHost ? (
          <HostView lobbyId={lobbyId} lobbyData={lobbyData} startGame={startGame} />
        ) : (
          <GameScreen lobbyId={lobbyId} lobbyData={lobbyData} leaveGame={leaveGame} />
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
