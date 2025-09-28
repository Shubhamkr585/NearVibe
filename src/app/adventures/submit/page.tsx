'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMapbox } from '@/components/providers/MapboxProvider';
import MapView from '@/components/map/MapView';

const CATEGORIES = [
  'Hiking',
  'Urban Exploration',
  'Food & Drink',
  'Cultural',
  'Nature',
  'Photography',
  'Historical',
  'Water Activity',
  'Family Friendly',
  'Nightlife'
];

export default function SubmitAdventurePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { userLocation } = useMapbox();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  // Set initial location based on user's location
  useEffect(() => {
    if (userLocation && !location) {
      setLocation(userLocation);
      setMapCenter(userLocation);
    }
  }, [userLocation, location]);

  // Handle map click to set location
  const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setLocation([lng, lat]);
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    // For demo purposes, we're just using placeholder URLs
    // In a real app, you would upload these to a storage service
    const newImageUrls = Array.from(e.target.files).map(
      (_, index) => `/placeholder-${index + 1}.jpg`
    );
    
    setImages([...images, ...Array.from(e.target.files)]);
    setImageUrls([...imageUrls, ...newImageUrls]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !duration || !location) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real app, you would upload images to a storage service first
      // and then use the returned URLs
      
      const response = await fetch('/api/adventures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          category,
          duration: parseInt(duration),
          location: {
            type: 'Point',
            coordinates: location
          },
          images: imageUrls.length > 0 ? imageUrls : ['/placeholder.jpg']
        })
      });
      
      if (response.ok) {
        router.push('/adventures');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit adventure');
      }
    } catch (error) {
      console.error('Error submitting adventure:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Submit a New Adventure</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) *
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="5"
            max="480"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            accept="image/*"
            multiple
          />
          
          {imageUrls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20 bg-gray-100 rounded">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location * (Click on the map to set location)
          </label>
          <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
            {mapCenter && (
              <MapView
                center={mapCenter}
                zoom={13}
                adventures={location ? [{
                  _id: 'new',
                  title: title || 'New Adventure',
                  location: {
                    type: 'Point',
                    coordinates: location
                  },
                  category: category || 'New',
                  duration: parseInt(duration) || 60
                } as any] : []}
              />
            )}
          </div>
          
          {location && (
            <p className="mt-1 text-sm text-gray-500">
              Selected location: {location[1].toFixed(6)}, {location[0].toFixed(6)}
            </p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {submitting ? 'Submitting...' : 'Submit Adventure'}
          </button>
        </div>
      </form>
    </div>
  );
}