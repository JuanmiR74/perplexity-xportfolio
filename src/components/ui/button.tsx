import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
};

const base = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
const variants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  outline: 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-900',
  ghost: 'hover:bg-slate-100 text-slate-900',
};
const sizes = { sm: 'h-9 px-3', default: 'h-10 px-4 py-2', lg: 'h-11 px-8' };

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
