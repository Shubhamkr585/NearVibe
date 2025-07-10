// import dbConnect from './dbConnect';
// import Adventure from './models/Adventure';

// async function seedAdventures() {
//   await dbConnect();
//   await Adventure.insertMany([
//     {
//       title: 'Sunset Hike',
//       description: 'A short hike to a nearby hill.',
//       location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
//       duration: 2,
//       difficulty: 'Easy',
//       userId: 'sample-user',
//     },
//   ]);
// }

// seedAdventures().catch(console.error);