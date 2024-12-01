import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/" className="navbar-logo">
          <img src="https://via.placeholder.com/60" alt="Logo" />
        </a>
      </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className="navbar-actions">
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
}

export default Navbar;
