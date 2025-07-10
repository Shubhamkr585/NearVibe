import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn('px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700', className)}
      {...props}
    >
      {children}
    </button>
  );
}