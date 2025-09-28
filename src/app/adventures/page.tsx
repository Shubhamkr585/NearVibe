'use client';

import React, { useState, useEffect } from 'react';
import { useMapbox } from '@/components/providers/MapboxProvider';
import AdventureCard from '@/components/adventure/AdventureCard';
import AdventureFilter from '@/components/adventure/AdventureFilter';
import MapView from '@/components/map/MapView';
import { Adventure, AdventureFilter as FilterType } from '@/types/adventure';

export default function AdventuresPage() {
  const { userLocation, isLoading: locationLoading } = useMapbox();
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterType>({});
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);

  // Fetch adventures based on filters and location
  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        
        // Add location if available
        if (userLocation) {
          params.append('lat', userLocation[1].toString());
          params.append('lng', userLocation[0].toString());
          params.append('maxDistance', (filters.maxDistance || 10).toString());
        }
        
        // Add other filters
        if (filters.categories?.length) {
          params.append('categories', filters.categories.join(','));
        }
        
        if (filters.maxDuration) {
          params.append('maxDuration', filters.maxDuration.toString());
        }
        
        if (filters.minRating) {
          params.append('minRating', filters.minRating.toString());
        }
        
        // Fetch data
        const response = await fetch(`/api/adventures?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch adventures');
        }
        
        const data = await response.json();
        setAdventures(data.adventures);
      } catch (err) {
        console.error('Error fetching adventures:', err);
        setError('Failed to load adventures. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if location is loaded or we're not waiting for it
    if (!locationLoading) {
      fetchAdventures();
    }
  }, [filters, userLocation, locationLoading]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  // Handle adventure selection from map
  const handleMarkerClick = (adventure: Adventure) => {
    setSelectedAdventure(adventure);
    // Scroll to the selected adventure in list view
    if (viewMode === 'list') {
      const element = document.getElementById(`adventure-${adventure._id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Adventures Near You</h1>
      
      {/* View toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Map View
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {adventures.length} adventures found
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="md:w-1/4">
          <AdventureFilter
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>
        
        {/* Main content area */}
        <div className="md:w-3/4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {adventures.length > 0 ? (
                    adventures.map(adventure => (
                      <div 
                        key={adventure._id}
                        id={`adventure-${adventure._id}`}
                        className={`transition-all duration-300 ${
                          selectedAdventure?._id === adventure._id
                            ? 'ring-2 ring-blue-500 scale-105'
                            : ''
                        }`}
                      >
                        <AdventureCard adventure={adventure} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <h3 className="text-xl font-medium text-gray-600">No adventures found</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your filters or location</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[70vh] rounded-lg overflow-hidden">
                  <MapView
                    adventures={adventures}
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}