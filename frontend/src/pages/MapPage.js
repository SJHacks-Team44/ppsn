import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPage.css';

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

    // DOWNTOWN
    for (let i = 0; i < 25; i++) {
      const type = crimeTypes[Math.floor(Math.random() * 5)]; // First 5 crime types more common downtown
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
    
    // EAST SJ
    for (let i = 0; i < 20; i++) {
      const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
      data.push({
        id: `east-${i}`,
        type,
        coordinates: [
          -121.82 + (Math.random() * 0.04 - 0.02),
          37.34 + (Math.random() * 0.05 - 0.025)
        ],
        description: descriptions[type],
        severity: Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low'),
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
    
    // NORTH SJ
    for (let i = 0; i < 10; i++) {
      const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
      data.push({
        id: `north-${i}`,
        type,
        coordinates: [
          -121.93 + (Math.random() * 0.04 - 0.02),
          37.38 + (Math.random() * 0.04 - 0.02)
        ],
        description: descriptions[type],
        severity: Math.random() > 0.8 ? 'medium' : 'low',
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
    
    // WEST SJ
    for (let i = 0; i < 15; i++) {
      const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
      data.push({
        id: `west-${i}`,
        type,
        coordinates: [
          -121.96 + (Math.random() * 0.04 - 0.02),
          37.32 + (Math.random() * 0.04 - 0.02)
        ],
        description: descriptions[type],
        severity: Math.random() > 0.7 ? 'medium' : 'low',
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
    
    // SOUTH SJ
    for (let i = 0; i < 12; i++) {
      const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
      data.push({
        id: `south-${i}`,
        type,
        coordinates: [
          -121.87 + (Math.random() * 0.04 - 0.02),
          37.26 + (Math.random() * 0.04 - 0.02)
        ],
        description: descriptions[type],
        severity: Math.random() > 0.7 ? 'medium' : 'low',
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
    
    return data;
  };

  // LOAD CRIME
  useEffect(() => {
    setTimeout(() => {
      setCrimeData(generateCrimeData());
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (map.current) return;
    
    console.log("Initializing map...");
    
    if (mapContainer.current) {
      mapContainer.current.style.height = '700px';
    }
    
    // CREATE MAP
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom
    });
    
    // NAVIGATION CONTROLS
    map.current.addControl(new mapboxgl.NavigationControl());
    
    map.current.on('load', () => {
      console.log("Map loaded successfully!");
      
      map.current.addSource('sj-boundary', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [[
              [-122.05, 37.12],
              [-121.58, 37.12],
              [-121.58, 37.46],
              [-122.05, 37.46],
              [-122.05, 37.12]
            ]]
          }
        }
      });
      
      map.current.addLayer({
        'id': 'sj-boundary-line',
        'type': 'line',
        'source': 'sj-boundary',
        'layout': {},
        'paint': {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.7
        }
      });
      
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
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'severity', ['get', 'properties']],
            'low', 0.5,
            'medium', 0.8,
            'high', 1
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 0.5,
            12, 1
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgba(0, 255, 255, 0.6)',
            0.4, 'rgba(0, 255, 0, 0.6)',
            0.6, 'rgba(255, 255, 0, 0.6)',
            0.8, 'rgba(255, 0, 0, 0.6)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 15,
            12, 25
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 0.9,
            12, 0.5
          ]
        }
      });
      
      map.current.addLayer({
        id: 'crime-points',
        type: 'circle',
        source: 'crime-data',
        minzoom: 11,
        paint: {
          'circle-color': [
            'match',
            ['get', 'type'],
            'Assault', '#ff0000',
            'Robbery', '#ff0000',
            'Theft', '#ff9900',
            'Burglary', '#ff9900',
            'Vehicle Theft', '#ff9900',
            'Vandalism', '#3366ff',
            'Drug Offense', '#33cc33',
            'DUI', '#33cc33',
            'Fraud', '#9900cc',
            '#999999'
          ],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11, 4,
            16, 12
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      });
      
      map.current.on('click', 'crime-points', (e) => {
        if (!e.features || e.features.length === 0) return;
        
        const feature = e.features[0];
        const coordinates = feature.geometry.coordinates.slice();
        const type = feature.properties.type;
        const description = feature.properties.description;
        const date = feature.properties.date;
        
        // POPUP
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="popup-content">
              <strong>${type}</strong>
              <p>${description}</p>
              <p>Date: ${date}</p>
            </div>
          `)
          .addTo(map.current);
      });
      
      map.current.on('mouseenter', 'crime-points', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      
      map.current.on('mouseleave', 'crime-points', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });
    
    // COORDINATE UPDATING FUNCTION
    map.current.on('move', () => {
      setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
      setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
      setZoom(parseFloat(map.current.getZoom().toFixed(2)));
    });
    
    const resizeMap = () => {
      if (map.current) {
        console.log("Resizing map...");
        map.current.resize();
      }
    };
    
    // RESIZE MAP
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
    
    console.log("Updating crime data on map...");
    
    const geojson = {
      type: 'FeatureCollection',
      features: crimeData.map(crime => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: crime.coordinates
        },
        properties: {
          id: crime.id,
          type: crime.type,
          description: crime.description,
          severity: crime.severity,
          date: crime.date
        }
      }))
    };
    
    if (map.current.getSource('crime-data')) {
      map.current.getSource('crime-data').setData(geojson);
      console.log("Crime data updated on map!");
    }
  }, [crimeData]);
  
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    console.log(`Filtering crime data by type: ${filter}`);
    
    if (map.current.getLayer('crime-points')) {
      if (filter === 'all') {
        map.current.setFilter('crime-points', null);
      } else {
        map.current.setFilter('crime-points', ['==', ['get', 'type'], filter]);
      }
    }
    
    if (map.current.getLayer('crime-heat')) {
      if (filter === 'all') {
        map.current.setFilter('crime-heat', null);
      } else {
        map.current.setFilter('crime-heat', ['==', ['get', 'type'], filter]);
      }
    }
  }, [filter]);

  const uniqueCrimeTypes = ['all'];
  if (crimeData.length > 0) {
    const types = [...new Set(crimeData.map(crime => crime.type))].sort();
    uniqueCrimeTypes.push(...types);
  }

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    console.log(`Finding route from ${startLocation} to ${endLocation}`);
    // ROUTE CALCULATION - [ INSERT HERE ]
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
            {uniqueCrimeTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Crimes' : type}
              </option>
            ))}
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
          <p>
            Note: This visualization uses simulated data based on general crime patterns in San Jose.
            For real-time data, visit <a href="https://www.crimemapping.com/map/ca/SanJose" target="_blank" rel="noopener noreferrer">CrimeMapping.com</a> 
            or the <a href="https://www.sjpd.org/records/crime-stats-maps" target="_blank" rel="noopener noreferrer">SJPD crime dashboard</a>.
          </p>
        </div>
      </div>
      
      <div className="sidebar">
        <h3>🔍 Find Safe Route</h3>
        <div className="route-form">
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
        </div>
      </div>
    </div>
  );
}

export default MapPage;