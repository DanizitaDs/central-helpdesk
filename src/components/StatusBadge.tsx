import { TicketStatus } from '@/types/ticket';
import { statusLabels, cn } from '@/lib/utils';
import { Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus | string | null | undefined;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  'Aberto': 'bg-status-open-bg text-status-open border-status-open/30',
  'Em Andamento': 'bg-status-in-progress-bg text-status-in-progress border-status-in-progress/30',
  'Resolvido': 'bg-status-resolved-bg text-status-resolved border-status-resolved/30',
  'Fechado': 'bg-status-closed-bg text-status-closed border-status-closed/30',
};

const statusIcons: Record<string, React.ReactNode> = {
  'Aberto': <Circle className="w-3 h-3" />,
  'Em Andamento': <Clock className="w-3 h-3" />,
  'Resolvido': <CheckCircle2 className="w-3 h-3" />,
  'Fechado': <XCircle className="w-3 h-3" />,
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalizedStatus = status || 'Aberto';
  const style = statusStyles[normalizedStatus] || statusStyles['Aberto'];
  const icon = statusIcons[normalizedStatus] || statusIcons['Aberto'];
  const label = statusLabels[normalizedStatus] || normalizedStatus;

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
