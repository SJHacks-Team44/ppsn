import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { MapProvider } from './MapContext';

function App() {
  return (
    <BrowserRouter>
      <MapProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }/>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </MapProvider>
    </BrowserRouter>
  );
}

export default App;
