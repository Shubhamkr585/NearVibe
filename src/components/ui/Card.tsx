import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  description: string;
  className?: string;
}

export function Card({ title, description, className }: CardProps) {
  return (
    <div className={cn('p-4 bg-white rounded shadow', className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}