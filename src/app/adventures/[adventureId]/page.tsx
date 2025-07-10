import { Adventure } from '@/types/adventure';
import { fetcher } from '@/lib/api/fetcher';

interface AdventurePageProps {
  params: { adventureId: string };
}

export default async function AdventurePage({ params }: AdventurePageProps) {
  const adventure: Adventure = await fetcher(`/api/adventures/${params.adventureId}`);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{adventure.title}</h1>
      <p>{adventure.description}</p>
      <p>Duration: {adventure.duration} hours</p>
      <p>Difficulty: {adventure.difficulty}</p>
    </div>
  );
}