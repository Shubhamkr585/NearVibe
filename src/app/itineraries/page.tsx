'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import { Itinerary } from '@/types/itinerary';

export default function ItinerariesPage() {
  const { data: session } = useSession();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [publicItineraries, setPublicItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my');

  // Fetch user's itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        
        if (session?.user) {
          // Fetch user's itineraries
          const response = await fetch('/api/itineraries');
          if (response.ok) {
            const data = await response.json();
            setItineraries(data);
          }
          
          // Fetch public itineraries
          const publicResponse = await fetch('/api/itineraries?public=true');
          if (publicResponse.ok) {
            const publicData = await publicResponse.json();
            setPublicItineraries(publicData);
          }
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItineraries();
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Itineraries</h1>
        <p className="mb-6">Please sign in to view and create itineraries.</p>
        <Link 
          href="/auth/signin" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Itineraries</h1>
        <Link 
          href="/itineraries/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Itinerary
        </Link>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('my')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'my'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Itineraries
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'public'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Public Itineraries
          </button>
        </nav>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'my' ? (
            itineraries.length > 0 ? (
              itineraries.map(itinerary => (
                <ItineraryCard key={itinerary._id} itinerary={itinerary} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-600">No itineraries yet</h3>
                <p className="text-gray-500 mt-2 mb-6">Create your first itinerary to get started</p>
                <Link 
                  href="/itineraries/create" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Itinerary
                </Link>
              </div>
            )
          ) : (
            publicItineraries.length > 0 ? (
              publicItineraries.map(itinerary => (
                <ItineraryCard key={itinerary._id} itinerary={itinerary} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-600">No public itineraries available</h3>
                <p className="text-gray-500 mt-2">
                  Check back later or create and share your own itineraries
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}