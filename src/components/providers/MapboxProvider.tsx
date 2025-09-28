'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your actual Mapbox token
// In production, this should be stored in environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoibmVhcnZpYmUiLCJhIjoiY2xzMTJ3NGo0MDFtMzJrcGR5ZDFlaHlrNyJ9.3V2Cs8S_pYwW6nCTDwPXvw';

interface MapboxContextType {
  mapboxgl: typeof mapboxgl;
  userLocation: [number, number] | null;
  isLoading: boolean;
  error: string | null;
}

const MapboxContext = createContext<MapboxContextType | undefined>(undefined);

export const useMapbox = () => {
  const context = useContext(MapboxContext);
  if (context === undefined) {
    throw new Error('useMapbox must be used within a MapboxProvider');
  }
  return context;
};

interface MapboxProviderProps {
  children: ReactNode;
}

export const MapboxProvider: React.FC<MapboxProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
          setIsLoading(false);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to retrieve your location');
          setIsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  }, []);

  const value = {
    mapboxgl,
    userLocation,
    isLoading,
    error
  };

  return (
    <MapboxContext.Provider value={value}>
      {children}
    </MapboxContext.Provider>
  );
};