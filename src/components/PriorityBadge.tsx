import { TicketPriority } from '@/types/ticket';
import { priorityLabels, cn } from '@/lib/utils';
import { ArrowDown, Minus, ArrowUp, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority | string | null | undefined;
  size?: 'sm' | 'md';
}

const priorityStyles: Record<string, string> = {
  'Baixa': 'bg-priority-low-bg text-priority-low border-priority-low/30',
  'Media': 'bg-priority-medium-bg text-priority-medium border-priority-medium/30',
  'Alta': 'bg-priority-high-bg text-priority-high border-priority-high/30',
  'Critica': 'bg-priority-critical-bg text-priority-critical border-priority-critical/30',
};

const priorityIcons: Record<string, React.ReactNode> = {
  'Baixa': <ArrowDown className="w-3 h-3" />,
  'Media': <Minus className="w-3 h-3" />,
  'Alta': <ArrowUp className="w-3 h-3" />,
  'Critica': <Flame className="w-3 h-3" />,
};

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const normalizedPriority = priority || 'Media';
  const style = priorityStyles[normalizedPriority] || priorityStyles['Media'];
  const icon = priorityIcons[normalizedPriority] || priorityIcons['Media'];
  const label = priorityLabels[normalizedPriority] || normalizedPriority;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        style,
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      {icon}
      {label}
    </span>
  );
}
