import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';  // Import the Footer component

function App() {
  return (
    <div className="App">
      <Navbar /> {/* Include the Navbar component */}
      <header className="App-header">
        <h1>Welcome to My Website</h1>
        {/* Additional content here */}
      </header>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
}

export default App;
