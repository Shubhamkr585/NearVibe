'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { signOut, getSession } from 'next-auth/react';

export default function Header() {
  const [session, setSession] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getSession().then((data) => setSession(data));
  }, []);

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold">
          NearVibe
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/adventures" className="hover:underline">Adventures</Link>
          <Link href="/itinerary" className="hover:underline">Itinerary</Link>
          <Link href="/log" className="hover:underline">Log</Link>
          {session?.user ? (
            <Button className="text-white border-white" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          ) : (
            <>
              <Link href="/auth/login">
                <Button className="text-white border-white">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-blue-700 text-white px-4 pb-4 space-y-3">
          <Link href="/adventures" className="block">Adventures</Link>
          <Link href="/itinerary" className="block">Itinerary</Link>
          <Link href="/log" className="block">Log</Link>
          {session?.user ? (
            <Button className="text-white w-full" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          ) : (
            <>
              <Link href="/auth/login">
                <Button className="text-white w-full">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-white text-blue-600 w-full">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}