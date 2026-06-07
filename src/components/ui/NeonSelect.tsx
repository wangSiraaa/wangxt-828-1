import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NeonSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const NeonSelect = forwardRef<HTMLSelectElement, NeonSelectProps>(({ label, error, options, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
    <select ref={ref} className={cn('w-full px-4 py-2 rounded-lg bg-neon-bgLight/50 border border-gray-600 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)} {...props}>
      {options.map(o => <option key={o.value} value={o.value} className="bg-neon-bgLight">{o.label}</option>)}
    </select>
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
));
NeonSelect.displayName = 'NeonSelect';
export default NeonSelect;
