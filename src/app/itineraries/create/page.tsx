'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Adventure } from '@/types/adventure';
import { ItineraryItem } from '@/types/itinerary';
import AdventureCard from '@/components/adventure/AdventureCard';

export default function CreateItineraryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [selectedAdventures, setSelectedAdventures] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!session && !loading) {
      router.push('/auth/signin');
    }
  }, [session, loading, router]);

  // Fetch adventures for selection
  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/adventures');
        if (response.ok) {
          const data = await response.json();
          setAdventures(data.adventures);
        }
      } catch (error) {
        console.error('Error fetching adventures:', error);
        setError('Failed to load adventures');
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, []);

  // Handle adding an adventure to the itinerary
  const handleAddAdventure = (adventure: Adventure) => {
    // Check if already added
    if (selectedAdventures.some(item => item.adventureId === adventure._id)) {
      return;
    }
    
    // Add to selected adventures
    setSelectedAdventures([
      ...selectedAdventures,
      {
        adventureId: adventure._id,
        startTime: '',
        title: adventure.title
      }
    ]);
  };

  // Handle removing an adventure from the itinerary
  const handleRemoveAdventure = (adventureId: string) => {
    setSelectedAdventures(selectedAdventures.filter(
      item => item.adventureId !== adventureId
    ));
  };

  // Handle updating start time for an adventure
  const handleUpdateStartTime = (adventureId: string, startTime: string) => {
    setSelectedAdventures(selectedAdventures.map(item => 
      item.adventureId === adventureId ? { ...item, startTime } : item
    ));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || selectedAdventures.length === 0) {
      setError('Please fill in all required fields and add at least one adventure');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          date,
          isPublic,
          items: selectedAdventures
        })
      });
      
      if (response.ok) {
        router.push('/itineraries');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create itinerary');
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Itinerary</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Make this itinerary public
            </span>
          </label>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">Selected Adventures</h2>
          
          {selectedAdventures.length === 0 ? (
            <p className="text-gray-500 italic">No adventures selected yet</p>
          ) : (
            <div className="space-y-4">
              {selectedAdventures.map((item) => {
                const adventure = adventures.find(a => a._id === item.adventureId);
                
                return (
                  <div key={item.adventureId} className="flex items-center border border-gray-200 rounded-lg p-4">
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.title}</h3>
                      {adventure && (
                        <p className="text-sm text-gray-500">
                          {adventure.category} • {adventure.duration} mins
                        </p>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <label className="block text-sm text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={item.startTime}
                        onChange={(e) => handleUpdateStartTime(item.adventureId, e.target.value)}
                        className="p-1 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveAdventure(item.adventureId)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {submitting ? 'Creating...' : 'Create Itinerary'}
          </button>
        </div>
      </form>
      
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold mb-4">Add Adventures</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adventures.map(adventure => (
              <div key={adventure._id} className="relative">
                <AdventureCard adventure={adventure} />
                <button
                  type="button"
                  onClick={() => handleAddAdventure(adventure)}
                  disabled={selectedAdventures.some(item => item.adventureId === adventure._id)}
                  className={`absolute top-2 right-2 rounded-full p-2 ${
                    selectedAdventures.some(item => item.adventureId === adventure._id)
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedAdventures.some(item => item.adventureId === adventure._id)
                    ? '✓'
                    : '+'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}