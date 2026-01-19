import { TicketPriority } from '@/types/ticket';
import { priorityLabels, cn } from '@/lib/utils';
import { AlertTriangle, ArrowDown, ArrowUp, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

const priorityStyles: Record<TicketPriority, string> = {
  low: 'bg-priority-low-bg text-priority-low',
  medium: 'bg-priority-medium-bg text-priority-medium',
  high: 'bg-priority-high-bg text-priority-high',
  critical: 'bg-priority-critical-bg text-priority-critical',
};

const priorityIcons: Record<TicketPriority, React.ReactNode> = {
  low: <ArrowDown className="w-3 h-3" />,
  medium: <ArrowUp className="w-3 h-3" />,
  high: <AlertTriangle className="w-3 h-3" />,
  critical: <Flame className="w-3 h-3" />,
};

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        priorityStyles[priority],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {priorityIcons[priority]}
      {priorityLabels[priority]}
    </span>
  );
}
