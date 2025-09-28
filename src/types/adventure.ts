export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export interface Adventure {
  _id?: string;
  title: string;
  description: string;
  location: Location;
  duration: number; // in minutes
  category: string[];
  images?: string[];
  createdBy?: string;
  rating?: number;
  reviews?: Review[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  _id?: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface AdventureFilter {
  location?: {
    longitude: number;
    latitude: number;
    maxDistance?: number; // in meters
  };
  duration?: {
    min?: number;
    max?: number;
  };
  category?: string[];
  search?: string;
}