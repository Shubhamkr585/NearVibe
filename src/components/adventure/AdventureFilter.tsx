'use client';

import React, { useState } from 'react';
import { AdventureFilter as FilterType } from '@/types/adventure';

interface AdventureFilterProps {
  onFilterChange: (filters: FilterType) => void;
  initialFilters?: FilterType;
}

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

const DURATIONS = [
  { label: '< 1 hour', value: 60 },
  { label: '1-2 hours', value: 120 },
  { label: '2-4 hours', value: 240 },
  { label: '4+ hours', value: 241 }
];

const AdventureFilter: React.FC<AdventureFilterProps> = ({
  onFilterChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<FilterType>(initialFilters);
  
  const handleCategoryChange = (category: string) => {
    const updatedCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    
    const updatedFilters = {
      ...filters,
      categories: updatedCategories.length > 0 ? updatedCategories : undefined
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleDurationChange = (duration: number) => {
    const updatedFilters = {
      ...filters,
      maxDuration: duration === filters.maxDuration ? undefined : duration
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const updatedFilters = {
      ...filters,
      maxDistance: isNaN(value) ? undefined : value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    const updatedFilters = {
      ...filters,
      minRating: isNaN(value) ? undefined : value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>
      
      {/* Categories */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filters.categories?.includes(category)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Duration */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Duration</h4>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleDurationChange(value)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filters.maxDuration === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Distance */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Distance (km)</h4>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={filters.maxDistance || 10}
          onChange={handleDistanceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1km</span>
          <span>{filters.maxDistance || 10}km</span>
          <span>50km</span>
        </div>
      </div>
      
      {/* Rating */}
      <div>
        <h4 className="font-medium mb-2">Minimum Rating</h4>
        <select
          value={filters.minRating || ''}
          onChange={handleRatingChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Any Rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
    </div>
  );
};

export default AdventureFilter;