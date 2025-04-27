import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Welcome to SafeRoute 🚀</h1>
        <p>Find the safest and smartest way to your destination.  
           Avoid crime hotspots and travel with confidence!</p>
        <Link to="/map" className="cta-button">Try It Now</Link>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🛡️ Safety First</h3>
            <p>We find the safest routes by analyzing crime reports and hotspots.</p>
          </div>
          <div className="feature-card">
            <h3>🚶 Live Tracking</h3>
            <p>Track your journey live and get alerts when near danger zones.</p>
          </div>
          <div className="feature-card">
            <h3>📍 Past Routes</h3>
            <p>View and revisit your saved routes anytime from your profile.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Fast and Easy</h3>
            <p>Simple clean interface that lets you navigate safely with 1 click.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} SafeRoute — All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
