import { TicketPriority } from '@/types/ticket';
import { cn } from '@/lib/utils';
import { ArrowDown, Minus, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority | string | null | undefined;
  size?: 'sm' | 'md';
}

const priorityConfig: Record<string, { label: string; style: string; icon: React.ReactNode }> = {
  'Baixa': { label: 'Baixa', style: 'bg-priority-low-bg text-priority-low border-priority-low/30', icon: <ArrowDown className="w-3 h-3" /> },
  'Media': { label: 'Média', style: 'bg-priority-medium-bg text-priority-medium border-priority-medium/30', icon: <Minus className="w-3 h-3" /> },
  'Alta': { label: 'Alta', style: 'bg-priority-high-bg text-priority-high border-priority-high/30', icon: <ArrowUp className="w-3 h-3" /> },
};

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const normalizedPriority = priority || 'Media';
  const config = priorityConfig[normalizedPriority] || priorityConfig['Media'];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.style,
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}