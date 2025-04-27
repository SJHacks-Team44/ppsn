import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>🔮 Safety Network</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/">🗺️ Map</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;