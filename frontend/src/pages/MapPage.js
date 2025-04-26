import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// I got this token from my Mapbox account
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obnNtaXRoMSIsImEiOiJja3hmZ2J6eWMwYXNrMnBwbGVxc3BmYXp6In0.abcdefghijklmnop'; // Replace with your token!

function MapPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // already initialized
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // starting position
      zoom: 10
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());
    
    // Cleanup on unmount
    return () => map.current.remove();
  }, []);

  return (
    <div>
      <h2>Safety Map</h2>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapPage;