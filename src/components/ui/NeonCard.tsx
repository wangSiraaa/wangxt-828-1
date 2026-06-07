import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  color?: 'cyan' | 'pink' | 'yellow' | 'green';
  glow?: boolean;
  style?: React.CSSProperties;
}

export default function NeonCard({ children, className, color = 'cyan', glow = false, style }: NeonCardProps) {
  const borders: Record<string, string> = {
    cyan: 'border-neon-cyan/50 hover:border-neon-cyan',
    pink: 'border-neon-pink/50 hover:border-neon-pink',
    yellow: 'border-neon-yellow/50 hover:border-neon-yellow',
    green: 'border-neon-green/50 hover:border-neon-green',
  };
  const glows: Record<string, string> = {
    cyan: 'shadow-neon-cyan', pink: 'shadow-neon-pink',
    yellow: 'shadow-neon-yellow', green: 'shadow-neon-green',
  };
  return (
    <div style={style} className={cn('glass-card rounded-xl p-6 transition-all duration-300 border', borders[color], glow && glows[color], className)}>
      {children}
    </div>
  );
}
