'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Itinerary } from '@/types/itinerary';
import { Adventure } from '@/types/adventure';
import { formatDate } from '@/lib/utils';
import MapView from '@/components/map/MapView';

interface ItineraryDetailPageProps {
  params: {
    id: string;
  };
}

export default function ItineraryDetailPage({ params }: ItineraryDetailPageProps) {
  const { id } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/itineraries/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Itinerary not found');
          } else if (response.status === 403) {
            setError('You do not have permission to view this itinerary');
          } else {
            setError('Failed to load itinerary');
          }
          return;
        }
        
        const data = await response.json();
        setItinerary(data);
        
        // Extract adventures from itinerary items
        if (data.items && data.items.length > 0) {
          const adventureData = data.items
            .filter(item => item.adventureId)
            .map(item => item.adventureId);
          
          setAdventures(adventureData);
        }
      } catch (err) {
        console.error('Error fetching itinerary:', err);
        setError('An error occurred while loading the itinerary');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/itineraries');
      } else {
        setError('Failed to delete itinerary');
      }
    } catch (err) {
      console.error('Error deleting itinerary:', err);
      setError('An error occurred while deleting the itinerary');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <Link href="/itineraries" className="text-emerald-600 hover:text-emerald-800 mt-2 inline-block">
            Return to Itineraries
          </Link>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p>Itinerary not found</p>
          <Link href="/itineraries" className="text-emerald-600 hover:text-emerald-800 mt-2 inline-block">
            Return to Itineraries
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.email === itinerary.createdBy;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/itineraries" className="text-emerald-600 hover:text-emerald-800">
          ← Back to Itineraries
        </Link>
        
        {isOwner && (
          <div className="flex space-x-2">
            <Link 
              href={`/itineraries/edit/${id}`}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{itinerary.title}</h1>
              <p className="text-gray-600 mb-4">{formatDate(itinerary.date)}</p>
            </div>
            
            {itinerary.isPublic && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Public
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{itinerary.description}</p>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Adventures</h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-md ${
                    viewMode === 'map'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>
            
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {itinerary.items && itinerary.items.length > 0 ? (
                  itinerary.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        {item.adventureId?.images && item.adventureId.images.length > 0 ? (
                          <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                            <Image
                              src={item.adventureId.images[0]}
                              alt={item.title || item.adventureId.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-200 h-16 w-16 rounded-md mr-4 flex items-center justify-center">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title || (item.adventureId && item.adventureId.title)}</h3>
                          {item.startTime && (
                            <p className="text-sm text-gray-600">Start time: {item.startTime}</p>
                          )}
                        </div>
                        
                        {item.adventureId && (
                          <Link
                            href={`/adventure/${item.adventureId._id}`}
                            className="text-emerald-600 hover:text-emerald-800 text-sm"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No adventures added to this itinerary yet.</p>
                )}
              </div>
            ) : (
              <div className="h-[500px] rounded-lg overflow-hidden">
                <MapView
                  adventures={adventures}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}