import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPage.css';
import { db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function MapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-121.8863);
  const [lat, setLat] = useState(37.3382);
  const [zoom, setZoom] = useState(11);
  const [loading, setLoading] = useState(true);
  const [crimeData, setCrimeData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [incidentType, setIncidentType] = useState('');

  const generateCrimeData = () => {
    const crimeTypes = ['Assault', 'Theft', 'Burglary', 'Vehicle Theft', 'Robbery', 'Vandalism', 'Drug Offense', 'DUI', 'Fraud'];
    const descriptions = {
      'Assault': 'Reported assault incident',
      'Theft': 'Personal property theft',
      'Burglary': 'Home break-in reported',
      'Vehicle Theft': 'Vehicle stolen from this area',
      'Robbery': 'Armed robbery incident',
      'Vandalism': 'Property damaged/vandalized',
      'Drug Offense': 'Drug-related activity reported',
      'DUI': 'Driving under influence arrest',
      'Fraud': 'Reported fraud incident'
    };

    const data = [];
    for (let i = 0; i < 25; i++) {
      const type = crimeTypes[Math.floor(Math.random() * 5)];
      data.push({
        id: `downtown-${i}`,
        type,
        coordinates: [
          -121.89 + (Math.random() * 0.03 - 0.015),
          37.33 + (Math.random() * 0.03 - 0.015)
        ],
        description: descriptions[type],
        severity: Math.random() > 0.5 ? 'high' : 'medium',
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
    return data;
  };

  useEffect(() => {
    setTimeout(() => {
      setCrimeData(generateCrimeData());
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) {
      console.error("Map container is not ready yet!");
      return;
    }

    mapContainer.current.style.height = '700px';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on('load', () => {
      map.current.addSource('crime-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.current.addLayer({
        id: 'crime-heat',
        type: 'heatmap',
        source: 'crime-data',
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'severity', ['get', 'properties']], 'low', 0.5, 'medium', 0.8, 'high', 1],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 12, 1],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 8, 15, 12, 25],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.9, 12, 0.5]
        }
      });

      map.current.addLayer({
        id: 'crime-points',
        type: 'circle',
        source: 'crime-data',
        minzoom: 11,
        paint: {
          'circle-color': '#ff0000',
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 4, 16, 12],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      });
    });

    map.current.on('move', () => {
      setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
      setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
      setZoom(parseFloat(map.current.getZoom().toFixed(2)));
    });

    const resizeMap = () => {
      if (map.current) {
        map.current.resize();
      }
    };
    setTimeout(resizeMap, 500);
    window.addEventListener('resize', resizeMap);

    return () => {
      window.removeEventListener('resize', resizeMap);
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded() || crimeData.length === 0) return;

    const geojson = {
      type: 'FeatureCollection',
      features: crimeData.map(crime => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: crime.coordinates },
        properties: { id: crime.id, type: crime.type, description: crime.description, severity: crime.severity, date: crime.date }
      }))
    };

    if (map.current.getSource('crime-data')) {
      map.current.getSource('crime-data').setData(geojson);
    }
  }, [crimeData]);

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    console.log(`Finding route from ${startLocation} to ${endLocation}`);
  };

  const submitIncident = async (e) => {
    e.preventDefault();
    if (!startLocation || !incidentType) {
      alert("Please enter a location and select an incident type before submitting!");
      return;
    }
    try {
      await addDoc(collection(db, "incidents"), {
        when: new Date().toISOString(),
        where: startLocation,
        what: incidentType,
        severity: "High"
      });
      console.log("✅ Incident submitted successfully!");
      alert("Incident submitted! Thank you.");
      setStartLocation('');
      setIncidentType('');
    } catch (error) {
      console.error("❌ Error submitting incident:", error);
      alert("Error submitting incident. Please try again.");
    }
  };

  const submitCurrentLocationIncident = async (e) => {
    e.preventDefault();
    if (!incidentType) {
      alert("Please select an incident type first!");
      return;
    }
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        await addDoc(collection(db, "incidents"), {
          when: new Date().toISOString(),
          coordinates: [longitude, latitude],
          what: incidentType,
          severity: "High"
        });
        console.log("✅ Incident with GPS submitted!");
        alert("Incident at your current location submitted!");
        setIncidentType('');
      } catch (error) {
        console.error("❌ Error submitting GPS incident:", error);
        alert("Error submitting incident. Please try again.");
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      alert("Failed to get your location.");
    });
  };

  return (
    <div className="main-layout">
      <div className="map-area">
        <div className="map-title">
          <h2>🌎 SAN JOSE SAFETY MAP</h2>
          <span className="status">● {!loading ? 'ACTIVE' : 'LOADING...'}</span>
        </div>

        <div className="filter-controls">
          <label htmlFor="crimeFilter" className="filter-label">Filter by crime type:</label>
          <select
            id="crimeFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Crimes</option>
          </select>
        </div>

        <div className="map-wrapper">
          <div ref={mapContainer} className="map-container"></div>
          {loading && (
            <div className="loading-overlay">
              <div className="loading-text">Loading crime data...</div>
            </div>
          )}
          <div className="coordinates-box">
            📍 {lng}, {lat} | 🔍 Zoom: {zoom}
          </div>
        </div>

        <div className="source-note">
          <p>Note: This is a prototype visualization using simulated data based on San Jose crime patterns.</p>
        </div>
      </div>

      <div className="sidebar">
        <h3>🔍 Find Safe Route / Report Incident</h3>
        <div className="route-form">
          {/* Find Safe Route */}
          <form onSubmit={handleRouteSubmit}>
            <div className="form-input">
              <label htmlFor="startLocation">Starting Location</label>
              <input
                type="text"
                id="startLocation"
                name="startLocation"
                placeholder="🏠 Your location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </div>
            <div className="form-input">
              <label htmlFor="endLocation">Destination</label>
              <input
                type="text"
                id="endLocation"
                name="endLocation"
                placeholder="🎯 Destination"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="route-button">FIND SAFEST ROUTE</button>
          </form>

          {/* 🚨 Report Incident */}
          <form onSubmit={submitIncident} style={{ marginTop: '20px' }}>
            <h4>🚨 Report an Incident</h4>

            <div className="form-input">
              <label htmlFor="incidentType">Incident Type</label>
              <select
                id="incidentType"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
              >
                <option value="">Select Incident Type</option>
                <option value="Assault">Assault</option>
                <option value="Theft">Theft</option>
                <option value="Burglary">Burglary</option>
                <option value="Vehicle Theft">Vehicle Theft</option>
                <option value="Robbery">Robbery</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Drug Offense">Drug Offense</option>
                <option value="DUI">DUI</option>
                <option value="Fraud">Fraud</option>
              </select>
            </div>

            <button type="submit" className="route-button" style={{ marginTop: '10px' }}>
              Submit Manual Location
            </button>
            <button
              onClick={submitCurrentLocationIncident}
              className="route-button"
              style={{ marginTop: '10px' }}
            >
              Submit My Current Location
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
