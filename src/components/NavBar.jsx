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
          Intelligence Check
          <img src="/Max D20.png" alt="Logo" className="logo-icon" />
        </Link>
      </div>

      {/* Dropdown Menu */}
      <div 
        className="menu-container"
        onMouseClick={() => setIsMenuOpen(true)}
        onMouseDown={() => setIsMenuOpen(false)}
      >
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
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/lobby" onClick={() => setIsMenuOpen(false)}>Song Request</Link></li>
          <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
