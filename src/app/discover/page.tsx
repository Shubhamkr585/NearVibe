'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DiscoverPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to adventures page
    router.replace('/adventures');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p className="ml-3 text-lg">Redirecting to adventures...</p>
    </div>
  );
}