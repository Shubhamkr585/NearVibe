'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { AdventureMap } from '@/components/ui/Map';
import { Card } from '@/components/ui/Card';
import { fetcher } from '@/lib/api/fetcher';
import { Adventure } from '@/types/adventure';
import { getCurrentLocation } from '@/lib/api/geolocation';

export default function Adventures() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const { data: adventures } = useSWR<Adventure[]>(
    location.lat ? `/api/adventures/nearby?lat=${location.lat}&lng=${location.lng}` : null,
    fetcher
  );

  useEffect(() => {
    getCurrentLocation()
      .then((pos) => setLocation(pos))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Find Adventures</h1>
      {location.lat ? (
        <AdventureMap adventures={adventures || []} initialLocation={location} />
      ) : (
        <p>Loading location...</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {adventures?.map((adventure) => (
          <Card
            key={adventure._id}
            title={adventure.title}
            description={adventure.description}
          />
        ))}
      </div>
    </div>
  );
}