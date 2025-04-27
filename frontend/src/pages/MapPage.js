import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapContext } from '../MapContext';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Papa from 'papaparse';
import Navbar from '../components/Navbar';
import './MapPage.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGh3YW5pbDE5MDciLCJhIjoiY205eXdvbWVzMWl0ODJscHZ1YWswa3VybyJ9.ifIhgY8CvD7JAD7Ug4MlxA'; // <-- replace with your real token

function MapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const {
    startLocation, setStartLocation,
    endLocation, setEndLocation,
    savedRoute, setSavedRoute,
    directionsText, setDirectionsText,
    crimeStats, setCrimeStats,
    searchAgainStart, setSearchAgainStart,
    searchAgainEnd, setSearchAgainEnd
  } = useContext(MapContext);

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [crimeData, setCrimeData] = useState([]);

  useEffect(() => {
    fetch('/crime-data.csv')
      .then(response => response.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        const crimes = parsed.data
          .filter(d => d.longitude && d.latitude)
          .map(d => ({
            lng: parseFloat(d.longitude),
            lat: parseFloat(d.latitude),
            type: d.type || 'Unknown'
          }));
        setCrimeData(crimes);
      });
  }, []);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-121.8863, 37.3382],
      zoom: 12
    });
    map.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  useEffect(() => {
    if (!crimeData.length || !map.current || !map.current.isStyleLoaded()) return;

    crimeData.forEach((crime) => {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([crime.lng, crime.lat])
        .setPopup(new mapboxgl.Popup().setText(crime.type))
        .addTo(map.current);
    });
  }, [crimeData]);

  useEffect(() => {
    if (!savedRoute || !map.current || !map.current.isStyleLoaded()) return;

    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: savedRoute
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#00ff88',
        'line-width': 6
      }
    });
  }, [savedRoute]);

  useEffect(() => {
    if (searchAgainStart && searchAgainEnd) {
      setStartLocation(searchAgainStart);
      setEndLocation(searchAgainEnd);
      setSearchAgainStart(null);
      setSearchAgainEnd(null);
      setTimeout(() => {
        handleFindRoute();
      }, 300); // Small delay so map is ready
    }
  }, [searchAgainStart, searchAgainEnd]);

  // Hide dropdowns if click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setStartSuggestions([]);
      setEndSuggestions([]);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = async (text, type) => {
    if (!text) {
      type === 'start' ? setStartSuggestions([]) : setEndSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?autocomplete=true&access_token=${mapboxgl.accessToken}`);
      const data = await res.json();
      const suggestions = data.features ? data.features.map(f => f.place_name) : [];
      type === 'start' ? setStartSuggestions(suggestions) : setEndSuggestions(suggestions);
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

  const handleSelectSuggestion = (address, type) => {
    if (type === 'start') {
      setStartLocation(address);
      setStartSuggestions([]);
    } else {
      setEndLocation(address);
      setEndSuggestions([]);
    }
  };

  const geocodeLocation = async (address) => {
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`);
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].geometry.coordinates;
    }
    throw new Error('Location not found');
  };

  const saveRouteToFirestore = async (startLocation, endLocation, routeCoordinates) => {
    if (!auth.currentUser) return;

    const routeRef = doc(db, "routes", `${startLocation}-${endLocation}`);
    await setDoc(routeRef, {
      userId: auth.currentUser.uid,
      start: startLocation,
      end: endLocation,
      route: JSON.stringify(routeCoordinates), // Save safely
      createdAt: new Date(),
    });
  };

  const handleFindRoute = async () => {
    if (!startLocation || !endLocation) {
      setPopupMessage('Please enter both start and end locations.');
      return;
    }
    try {
      const startCoords = await geocodeLocation(startLocation);
      const endCoords = await geocodeLocation(endLocation);

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;
        const steps = data.routes[0].legs[0].steps;

        setSavedRoute(route);
        saveRouteToFirestore(startLocation, endLocation, route.coordinates);

        const text = steps.map((step, idx) => `${idx + 1}. ${step.maneuver.instruction}`).join('\n');
        setDirectionsText(text);
      } else {
        setPopupMessage('No route found.');
      }
    } catch (error) {
      console.error(error);
      setPopupMessage('Error finding route.');
    }
  };

  const downloadDirections = () => {
    const element = document.createElement("a");
    const file = new Blob([directionsText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "directions.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <Navbar />
      <div className="page-layout">
        <div className="sidebar">
          <h2>Safest Route Finder</h2>

          <div className="form">
            <div className="form-group">
              <label>Start Location</label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => {
                  setStartLocation(e.target.value);
                  handleSearch(e.target.value, 'start');
                }}
                placeholder="Enter start address"
              />
              {startSuggestions.length > 0 && (
                <ul className="suggestions">
                  {startSuggestions.map((sug, idx) => (
                    <li key={idx} onClick={() => handleSelectSuggestion(sug, 'start')}>
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label>End Location</label>
              <input
                type="text"
                value={endLocation}
                onChange={(e) => {
                  setEndLocation(e.target.value);
                  handleSearch(e.target.value, 'end');
                }}
                placeholder="Enter end address"
              />
              {endSuggestions.length > 0 && (
                <ul className="suggestions">
                  {endSuggestions.map((sug, idx) => (
                    <li key={idx} onClick={() => handleSelectSuggestion(sug, 'end')}>
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="find-route-button" onClick={handleFindRoute}>Find Safest Route</button>

            <Link to="/profile" className="profile-link">👤 My Profile</Link>

            {directionsText && (
              <div className="directions-viewer">
                <h3>Directions:</h3>
                <div className="directions-scroll">
                  {directionsText.split('\n').map((step, idx) => {
                    let icon = '➡️'; // Default
                    if (step.toLowerCase().includes('left')) icon = '⬅️';
                    else if (step.toLowerCase().includes('right')) icon = '➡️';
                    else if (step.toLowerCase().includes('continue')) icon = '⬆️';
                    else if (step.toLowerCase().includes('u-turn')) icon = '🔄';
                    else if (step.toLowerCase().includes('arrive')) icon = '🛑';

                    return (
                      <div key={idx} className="direction-step">
                        <span className="direction-icon">{icon}</span>
                        <span className="direction-text">{step}</span>
                      </div>
                    );
                  })}
                </div>

                <button className="download-button" onClick={downloadDirections}>
                  📥 Download Directions
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="map-container" ref={mapContainer} />
      </div>

      {popupMessage && (
        <div className="custom-popup">
          <p>{popupMessage}</p>
          <button onClick={() => setPopupMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default MapPage;
