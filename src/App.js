import React from 'react';
import Navbar from './components/Navbar'; // Adjust the path if needed
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar /> {/* Add the Navbar Component */}
      <main>
        <h1>Welcome to My App</h1>
        <p>This is the main content of the page.</p>
      </main>
    </div>
  );
}

export default App;
