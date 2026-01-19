import { TicketPriority } from '@/types/ticket';
import { priorityLabels, cn } from '@/lib/utils';
import { AlertTriangle, ArrowDown, ArrowUp, Flame, Minus } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority | string | null | undefined;
  size?: 'sm' | 'md';
}

const priorityStyles: Record<string, string> = {
  low: 'bg-priority-low-bg text-priority-low',
  medium: 'bg-priority-medium-bg text-priority-medium',
  high: 'bg-priority-high-bg text-priority-high',
  critical: 'bg-priority-critical-bg text-priority-critical',
  // Portuguese values
  'Baixa': 'bg-priority-low-bg text-priority-low',
  'Média': 'bg-priority-medium-bg text-priority-medium',
  'Alta': 'bg-priority-high-bg text-priority-high',
  'Crítica': 'bg-priority-critical-bg text-priority-critical',
};

const priorityIcons: Record<string, React.ReactNode> = {
  low: <ArrowDown className="w-3 h-3" />,
  medium: <Minus className="w-3 h-3" />,
  high: <ArrowUp className="w-3 h-3" />,
  critical: <Flame className="w-3 h-3" />,
  // Portuguese values
  'Baixa': <ArrowDown className="w-3 h-3" />,
  'Média': <Minus className="w-3 h-3" />,
  'Alta': <ArrowUp className="w-3 h-3" />,
  'Crítica': <Flame className="w-3 h-3" />,
};

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const normalizedPriority = priority || 'medium';
  const style = priorityStyles[normalizedPriority] || priorityStyles.medium;
  const icon = priorityIcons[normalizedPriority] || priorityIcons.medium;
  const label = priorityLabels[normalizedPriority] || normalizedPriority;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        style,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {icon}
      {label}
    </span>
  );
}
