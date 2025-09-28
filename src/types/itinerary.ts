export interface ItineraryItem {
  adventureId: string;
  startTime: Date;
  notes?: string;
}

export interface Itinerary {
  _id?: string;
  title: string;
  description?: string;
  userId: string;
  date: Date;
  items: ItineraryItem[];
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}