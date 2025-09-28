import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Adventure from '@/lib/models/adventure';
import { AdventureFilter } from '@/types/adventure';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const filters: AdventureFilter = {};
    
    // Location-based filtering
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const maxDistance = searchParams.get('maxDistance');
    
    // Category filtering
    const categories = searchParams.get('categories');
    if (categories) {
      filters.categories = categories.split(',');
    }
    
    // Duration filtering
    const maxDuration = searchParams.get('maxDuration');
    if (maxDuration) {
      filters.maxDuration = parseInt(maxDuration);
    }
    
    // Rating filtering
    const minRating = searchParams.get('minRating');
    if (minRating) {
      filters.minRating = parseInt(minRating);
    }
    
    // Build query
    const query: any = {};
    
    // Add category filter
    if (filters.categories && filters.categories.length > 0) {
      query.category = { $in: filters.categories };
    }
    
    // Add duration filter
    if (filters.maxDuration) {
      query.duration = { $lte: filters.maxDuration };
    }
    
    // Add rating filter
    if (filters.minRating) {
      query.averageRating = { $gte: filters.minRating };
    }
    
    // Add geospatial query if coordinates are provided
    if (lat && lng && maxDistance) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
        }
      };
    }
    
    // Execute query with pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const adventures = await Adventure.find(query)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name image')
      .sort({ createdAt: -1 });
    
    const total = await Adventure.countDocuments(query);
    
    return NextResponse.json({
      adventures,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching adventures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch adventures' },
      { status: 500 }
    );
  }
}