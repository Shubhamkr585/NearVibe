import Link from 'next/link';
import { auth, signOut } from 'next-auth';

import { Button } from '../ui/Button';

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          NearVibe
        </Link>
        <nav className="space-x-4">
          <Link href="/adventures">Adventures</Link>
          <Link href="/itinerary">Itinerary</Link>
          <Link href="/log">Log</Link>
          {session?.user ? (
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <Button variant="ghost">Sign Out</Button>
            </form>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}