import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Itinerary from '@/lib/models/itinerary';

// Get all itineraries for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';
    
    // If public=true, get all public itineraries
    // Otherwise, get only the user's itineraries
    const query = isPublic 
      ? { isPublic: true }
      : { userId: session.user.id };
    
    const itineraries = await Itinerary.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.adventureId',
        select: 'title images category location'
      });
    
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

// Create a new itinerary
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    const itinerary = new Itinerary({
      ...data,
      userId: session.user.id
    });
    
    await itinerary.save();
    
    return NextResponse.json(itinerary, { status: 201 });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
}