'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Adventure } from '@/types/adventure';

interface AdventureFormData {
  title: string;
  description: string;
  duration: number;
  difficulty: string;
}

export function AdventureForm({ onSubmit }: { onSubmit: (data: AdventureFormData) => void }) {
  const { register, handleSubmit } = useForm<AdventureFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Title</label>
        <input {...register('title')} className="w-full p-2 border" />
      </div>
      <div>
        <label>Description</label>
        <textarea {...register('description')} className="w-full p-2 border" />
      </div>
      <div>
        <label>Duration (hours)</label>
        <input type="number" {...register('duration')} className="w-full p-2 border" />
      </div>
      <div>
        <label>Difficulty</label>
        <select {...register('difficulty')} className="w-full p-2 border">
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <Button type="submit">Submit Adventure</Button>
    </form>
  );
}