'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMapbox } from '@/components/providers/MapboxProvider';
import mapboxgl from 'mapbox-gl';
import { Adventure } from '@/types/adventure';

interface MapViewProps {
  adventures?: Adventure[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (adventure: Adventure) => void;
}

const MapView: React.FC<MapViewProps> = ({
  adventures = [],
  center,
  zoom = 11,
  onMarkerClick
}) => {
  const { mapboxgl, userLocation, isLoading } = useMapbox();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || map.current || isLoading) return;

    const initialCenter = center || userLocation || [-74.5, 40]; // Default to NYC area if no location

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCenter,
      zoom: zoom
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker if available
    if (userLocation) {
      new mapboxgl.Marker({ color: '#0000FF' })
        .setLngLat(userLocation)
        .addTo(map.current)
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'));
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, userLocation, isLoading, zoom]);

  // Add adventure markers when adventures or map changes
  useEffect(() => {
    if (!map.current || !mapLoaded || adventures.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for each adventure
    adventures.forEach(adventure => {
      if (!adventure.location?.coordinates) return;
      
      const [lng, lat] = adventure.location.coordinates;
      
      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div class="p-2">
          <h3 class="font-bold text-sm">${adventure.title}</h3>
          <p class="text-xs">${adventure.category}</p>
          <p class="text-xs">${adventure.duration} mins</p>
        </div>
      `;
      
      // Create marker
      const marker = new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setDOMContent(popupContent))
        .addTo(map.current);
      
      // Add click handler
      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => {
          onMarkerClick(adventure);
        });
      }
      
      markers.current.push(marker);
    });

    // Fit bounds to include all markers if there are multiple adventures
    if (adventures.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      adventures.forEach(adventure => {
        if (adventure.location?.coordinates) {
          bounds.extend(adventure.location.coordinates as [number, number]);
        }
      });
      
      // Include user location in bounds if available
      if (userLocation) {
        bounds.extend(userLocation);
      }
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [adventures, mapLoaded, onMarkerClick, userLocation]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapView;