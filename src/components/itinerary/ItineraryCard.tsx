'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Itinerary } from '@/types/itinerary';
import { formatDate } from '@/lib/utils';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  // Get the first adventure image to use as the itinerary cover
  const coverImage = itinerary.items?.[0]?.adventureId?.images?.[0] || '/placeholder.jpg';
  
  return (
    <Link href={`/itineraries/${itinerary._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={coverImage}
            alt={itinerary.title}
            fill
            className="object-cover"
          />
          {itinerary.isPublic && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Public
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 truncate">{itinerary.title}</h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {itinerary.description || 'No description provided'}
          </p>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {formatDate(itinerary.date)}
            </span>
            
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {itinerary.items?.length || 0} adventures
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItineraryCard;