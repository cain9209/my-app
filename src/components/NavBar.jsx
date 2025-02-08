import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src="/Max D20.png" alt="Logo" className="logo-icon" />
        </Link>
      </div>

      {/* Dropdown Menu */}
      <div className="menu-container">
        <button 
          className="menu-button" 
          onClick={(e) => {
            e.stopPropagation(); // Prevents closing when clicking the button
            setIsMenuOpen(prevState => !prevState);
          }}
        >
        ☰ Menu
        </button> 
        
        <ul className={`nav-links ${isMenuOpen ? "show-menu" : ""}`}>
          <li><a href="https://www.ictrivia.com/target=" target = "_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="https://google.com" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Song Request</a></li>
          <li><a href="https://www.ictrivia.com/about" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>About</a></li>
          <li><a href="https://www.ictrivia.com/contact" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
