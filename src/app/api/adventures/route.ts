import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose/dbConnect';
import Adventure from '@/lib/mongoose/models/Adventure';
import { Adventure as AdventureType } from '@/types/adventure';
import { auth } from '@auth';

export async function GET() {
  await dbConnect();
  const adventures: AdventureType[] = await Adventure.find();
  return NextResponse.json(adventures);
}

export async function POST(request: Request) {
  await dbConnect();
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const adventure = await Adventure.create({ ...data, userId: session.user.id });
  return NextResponse.json(adventure);
}