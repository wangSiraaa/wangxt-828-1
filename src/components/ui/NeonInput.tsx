import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
    <input ref={ref} className={cn('w-full px-4 py-2 rounded-lg bg-neon-bgLight/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)} {...props} />
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
));
NeonInput.displayName = 'NeonInput';
export default NeonInput;
