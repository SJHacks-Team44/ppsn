import { createContext, useState } from 'react';

export const MapContext = createContext();

export function MapProvider({ children }) {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [savedRoute, setSavedRoute] = useState(null);
  const [directionsText, setDirectionsText] = useState('');
  const [crimeStats, setCrimeStats] = useState({ total: 0, breakdown: {} });

  return (
    <MapContext.Provider
      value={{
        startLocation,
        setStartLocation,
        endLocation,
        setEndLocation,
        savedRoute,
        setSavedRoute,
        directionsText,
        setDirectionsText,
        crimeStats,
        setCrimeStats
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
