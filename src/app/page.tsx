"use client";
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold">Welcome to NearVibe</h1>
      <p className="mt-4">Discover short, local adventures tailored to you.</p>
      <div className="mt-6">
        <Link href="/adventures">
          <Button>Find Adventures</Button>
        </Link>
      </div>
    </div>
  );
}