import { TicketStatus } from '@/types/ticket';
import { statusLabels, cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TicketStatus | string | null | undefined;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  open: 'bg-status-open-bg text-status-open',
  in_progress: 'bg-status-in-progress-bg text-status-in-progress',
  resolved: 'bg-status-resolved-bg text-status-resolved',
  closed: 'bg-status-closed-bg text-status-closed',
  // Portuguese values
  'Aberto': 'bg-status-open-bg text-status-open',
  'Em Andamento': 'bg-status-in-progress-bg text-status-in-progress',
  'Resolvido': 'bg-status-resolved-bg text-status-resolved',
  'Fechado': 'bg-status-closed-bg text-status-closed',
};

const statusDotStyles: Record<string, string> = {
  open: 'bg-status-open',
  in_progress: 'bg-status-in-progress',
  resolved: 'bg-status-resolved',
  closed: 'bg-status-closed',
  // Portuguese values
  'Aberto': 'bg-status-open',
  'Em Andamento': 'bg-status-in-progress',
  'Resolvido': 'bg-status-resolved',
  'Fechado': 'bg-status-closed',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalizedStatus = status || 'open';
  const style = statusStyles[normalizedStatus] || statusStyles.open;
  const dotStyle = statusDotStyles[normalizedStatus] || statusDotStyles.open;
  const label = statusLabels[normalizedStatus] || normalizedStatus;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        style,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span
        className={cn(
          'rounded-full mr-1.5',
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          dotStyle
        )}
      />
      {label}
    </span>
  );
}
