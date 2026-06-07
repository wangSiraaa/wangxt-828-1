import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export default function NeonButton({ children, variant = 'primary', size = 'md', glow, className, ...props }: NeonButtonProps) {
  const variants: Record<string, string> = {
    primary: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/30 hover:border-neon-cyan',
    secondary: 'bg-neon-purple/20 text-neon-pink border-neon-pink/50 hover:bg-neon-purple/30 hover:border-neon-pink',
    danger: 'bg-red-900/30 text-red-400 border-red-500/50 hover:bg-red-900/50 hover:border-red-500',
    success: 'bg-neon-green/20 text-neon-green border-neon-green/50 hover:bg-neon-green/30 hover:border-neon-green',
    warning: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/50 hover:bg-neon-yellow/30 hover:border-neon-yellow',
  };
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };
  return (
    <button className={cn('rounded-lg font-medium transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neon-bg disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
