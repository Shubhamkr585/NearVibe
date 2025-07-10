import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose/dbConnect';
import Itinerary from '@/lib/mongoose/models/Itinerary';
import { Itinerary as ItineraryType } from '@/types/itinerary';
import { auth } from '@auth';

export async function POST(request: Request) {
  await dbConnect();
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const itinerary: ItineraryType = await Itinerary.create({ ...data, userId: session.user.id });
  return NextResponse.json(itinerary);
}