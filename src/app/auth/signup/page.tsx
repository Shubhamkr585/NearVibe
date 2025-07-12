'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { Card } from '@/components/ui/Card';
import { fetcher } from '@/lib/api/fetcher';
import { Log } from '@/types/log';

export default function AdventureLog() {
  const { data: session } = useSession();

  const { data: logs } = useSWR<Log[]>(
    session ? `/api/logs?userId=${session.user.id}` : null,
    fetcher
  );

  if (!session) {
    return <div className="p-4">You must be signed in to view your logs.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Your Adventure Log</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {logs?.map((log) => (
          <Card
            key={log._id}
            title={`Adventure on ${new Date(log.createdAt).toLocaleDateString()}`}
            description={log.notes || 'No notes'}
          />
        ))}
      </div>
    </div>
  );
}
