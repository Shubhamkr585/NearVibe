'use client';
import { ItineraryCanvas } from '@/components/canvas/ItineraryCanvas';

export default function Itinerary() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Build Your Itinerary</h1>
      <ItineraryCanvas />
    </div>
  );
}