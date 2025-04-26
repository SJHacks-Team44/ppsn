import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>Predictive Safety Network</h1>
          <nav>
            <ul>
              <li><a href="/">Map</a></li>
              <li><a href="/profile">Profile</a></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;