export interface User {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  favorites?: string[]; // Adventure IDs
  itineraries?: string[]; // Itinerary IDs
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
}