useEffect(() => {
  if (!lobbyId) return;
  
  const lobbyRef = doc(db, "lobbies", lobbyId);
  const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
    if (snapshot.exists()) {
      setLobbyData(snapshot.data());
      console.log("Lobby Data Updated:", snapshot.data()); // ✅ Logs updates
    } else {
      console.log("Lobby does not exist!");
    }
  });

  return () => unsubscribe();
}, [lobbyId]);
