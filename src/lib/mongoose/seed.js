import dbConnect from './dbConnectMongoose';
import Adventure from './models/Adventure';
import User from './models/User';
import bcrypt from 'bcryptjs';

async function seedAdventures() {
  await dbConnect();
  const user = await User.findOne({ email: 'test@example.com' }) ||
    await User.create({
      email: 'test@example.com',
      name: 'Test User',
      password: await bcrypt.hash('password', 10),
    });
  await Adventure.insertMany([
    {
      title: 'Sunset Hike',
      description: 'A short hike to a nearby hill.',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      duration: 2,
      difficulty: 'Easy',
      userId: user._id,
    },
  ]);
  console.log('Database seeded successfully');
}

seedAdventures().catch(console.error);