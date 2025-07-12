'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  center: [number, number];
  zoom?: number;
}

export default function Map({ center, zoom = 10 }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
    });
    new mapboxgl.Marker().setLngLat(center).addTo(map);
    return () => map.remove();
  }, [center, zoom]);

  return <div ref={mapContainer} className="w-full h-96" />;
}