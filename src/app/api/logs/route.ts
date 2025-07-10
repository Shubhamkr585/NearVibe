import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose/dbConnect';
import Log from '@/lib/mongoose/models/Log';
import { Log as LogType } from '@/types/log';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const logs: LogType[] = await Log.find({ userId });
  return NextResponse.json(logs);
}