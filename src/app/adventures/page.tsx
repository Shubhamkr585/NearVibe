import { auth } from '@auth';
import dbConnect from '@/lib/mongoose/dbConnectMongoose';
import Adventure from '@/lib/mongoose/models/Adventure';
import Map from '@/components/Map';
import { Card } from '@/components/ui/Card';

export default async function AdventuresPage() {
  const session = await auth();
  await dbConnect();
  const adventures = await Adventure.find({ userId: session?.user?.id || 'sample-user' }).lean();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Adventures</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adventures.map((adventure: any) => (
          <Card key={adventure._id}>
            <h2>{adventure.title}</h2>
            <p>{adventure.description}</p>
            <Map center={adventure.location.coordinates} />
          </Card>
        ))}
      </div>
    </div>
  );
}