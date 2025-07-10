'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
      }),
    });
    if (response.ok) {
      router.push('/auth/login');
    } else {
      setError('Failed to sign up');
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input name="name" type="text" className="w-full p-2 border" />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" className="w-full p-2 border" />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" className="w-full p-2 border" />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" variant="default">Sign Up</Button>
      </form>
    </div>
  );
}