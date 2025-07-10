export interface Adventure {
  _id: string;
  title: string;
  description: string;
  location: { type: string; coordinates: [number, number] };
  duration: number;
  difficulty: string;
  userId: string;
  createdAt: Date;
}