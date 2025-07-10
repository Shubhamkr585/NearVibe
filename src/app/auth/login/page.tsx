'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.get('email'),
      password: formData.get('password'),
    });
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/adventures');
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input name="email" type="email" className="w-full p-2 border" />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" className="w-full p-2 border" />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">Sign In</Button>
      </form>
    </div>
  );
}