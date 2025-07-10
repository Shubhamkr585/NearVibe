'use client';
import { useForm } from 'react-hook-form';
import { AdventureForm } from '@/components/forms/AdventureForm';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SubmitAdventure() {
  const router = useRouter();
  const { data: session } = useSession();

  const onSubmit = async (data: any) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    const response = await fetch('/api/adventures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, location: { type: 'Point', coordinates: [0, 0] } }),
    });
    if (response.ok) router.push('/adventures');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Submit Adventure</h1>
      <AdventureForm onSubmit={onSubmit} />
    </div>
  );
}