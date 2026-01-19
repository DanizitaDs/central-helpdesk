import { TicketStatus } from '@/types/ticket';
import { statusLabels, cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<TicketStatus, string> = {
  open: 'bg-status-open-bg text-status-open',
  in_progress: 'bg-status-in-progress-bg text-status-in-progress',
  resolved: 'bg-status-resolved-bg text-status-resolved',
  closed: 'bg-status-closed-bg text-status-closed',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        statusStyles[status],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span
        className={cn(
          'rounded-full mr-1.5',
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          status === 'open' && 'bg-status-open',
          status === 'in_progress' && 'bg-status-in-progress',
          status === 'resolved' && 'bg-status-resolved',
          status === 'closed' && 'bg-status-closed'
        )}
      />
      {statusLabels[status]}
    </span>
  );
}
