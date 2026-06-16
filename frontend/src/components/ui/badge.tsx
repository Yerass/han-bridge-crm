import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const TONES: Record<string, string> = {
  default: 'bg-secondary text-secondary-foreground',
  green: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  red: 'bg-red-500/15 text-red-600 dark:text-red-400',
  amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
};

export function Badge({ className, tone = 'default', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof TONES }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)} {...props} />;
}
