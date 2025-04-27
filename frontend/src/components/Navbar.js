import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, logOut } from '../Firebase';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      window.location.href = '/signin';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🚀 SafeRoute</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Map</Link>
          <Link to="/profile" className="navbar-link">Profile</Link>
          {!user ? (
            <>
              <Link to="/signin" className="navbar-link">Sign In</Link>
              <Link to="/signup" className="navbar-link">Sign Up</Link>
            </>
          ) : (
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
