import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Me</h3>
          <p>Email: Zacharylcain@gmail.com </p>
          <p>Phone: +1 (816) 400 - 3625</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cain Technologies LLC. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
