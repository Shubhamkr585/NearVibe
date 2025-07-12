// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, MapPinned, LogOut, Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { label: 'Home', href: '/', icon: <Home size={20} /> },
  { label: 'Explore', href: '/explore', icon: <Compass size={20} /> },
  { label: 'Adventure Log', href: '/adventure-log', icon: <MapPinned size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded"
        onClick={() => setOpen(!open)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r shadow-lg transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:relative md:translate-x-0 md:block z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 text-2xl font-bold text-purple-600 dark:text-purple-400">
            NearVibe
          </div>

          {/* Profile Section */}
          {session && (
            <div className="flex items-center gap-3 px-6 py-4 border-t border-b dark:border-gray-700">
              <img
                src={session.user?.image || '/default-avatar.png'}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session.user?.email}
                </p>
              </div>
            </div>
          )}

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800 px-4 py-3 m-4 rounded-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
