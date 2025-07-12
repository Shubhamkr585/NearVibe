import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose/dbConnect';
import User from '@/lib/mongoose/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();
  const { email, name, password } = await request.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, name, password: hashedPassword });
  return NextResponse.json({ success: true });
}