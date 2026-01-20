import { TicketStatus } from '@/types/ticket';
import { cn } from '@/lib/utils';
import { Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus | string | null | undefined;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; style: string; icon: React.ReactNode }> = {
  'Aberto': { label: 'Aberto', style: 'bg-status-open-bg text-status-open border-status-open/30', icon: <Circle className="w-3 h-3" /> },
  'Em Andamento': { label: 'Em Andamento', style: 'bg-status-in-progress-bg text-status-in-progress border-status-in-progress/30', icon: <Clock className="w-3 h-3" /> },
  'Resolvido': { label: 'Resolvido', style: 'bg-status-resolved-bg text-status-resolved border-status-resolved/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  'Cancelado': { label: 'Cancelado', style: 'bg-status-cancelled-bg text-status-cancelled border-status-cancelled/30', icon: <XCircle className="w-3 h-3" /> },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalizedStatus = status || 'Aberto';
  const config = statusConfig[normalizedStatus] || statusConfig['Aberto'];

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