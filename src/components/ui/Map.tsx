'use client';
import { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import { Adventure } from '@/types/adventure';
import { Location } from '@/lib/utils/geolocation';

interface MapProps {
  adventures: Adventure[];
  initialLocation: Location;
}

export function AdventureMap({ adventures, initialLocation }: MapProps) {
  const [viewport, setViewport] = useState({
    latitude: initialLocation.lat,
    longitude: initialLocation.lng,
    zoom: 12,
  });

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      {...viewport}
      onMove={(evt) => setViewport(evt.viewState)}
      style={{ width: '100%', height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {adventures.map((adventure) => (
        <Marker
          key={adventure._id}
          latitude={adventure.location.coordinates[1]}
          longitude={adventure.location.coordinates[0]}
        />
      ))}
    </Map>
  );
}