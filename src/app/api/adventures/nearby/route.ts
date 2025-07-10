import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose/dbConnect';
import Adventure from '@/lib/mongoose/models/Adventure';
import { Adventure as AdventureType } from '@/types/adventure';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');

  const adventures: AdventureType[] = await Adventure.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: 10000, // 10km
      },
    },
  });

  return NextResponse.json(adventures);
}