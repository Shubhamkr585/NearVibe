export interface Log {
  _id: string;
  userId: string;
  adventureId: string;
  notes?: string;
  photos: string[];
  createdAt: Date;
}