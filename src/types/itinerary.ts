export interface Itinerary {
  _id: string;
  userId: string;
  items: { id: string; x: number; y: number; content: string }[];
  createdAt: Date;
}