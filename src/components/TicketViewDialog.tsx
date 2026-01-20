import { Ticket } from '@/types/ticket';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Mail, Calendar, Hash } from 'lucide-react';

interface TicketViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
}

export function TicketViewDialog({ open, onOpenChange, ticket }: TicketViewDialogProps) {
  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-muted-foreground text-sm font-mono flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {ticket.id}
            </span>
            <StatusBadge status={ticket.status} size="sm" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {ticket.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={ticket.priority} />
            <CategoryBadge category={ticket.category} />
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h4>
            <p className="text-foreground whitespace-pre-wrap bg-secondary/50 rounded-lg p-4">
              {ticket.description || 'Sem descrição'}
            </p>
          </div>

          {/* Requester Info */}
          {(ticket.requester_name || ticket.requester_email) && (
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Solicitante</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ticket.requester_name && (
                  <div className="flex items-center gap-2 text-foreground">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {ticket.requester_name}
                  </div>
                )}
                {ticket.requester_email && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {ticket.requester_email}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Criado: {formatDateTime(ticket.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Atualizado: {formatDateTime(ticket.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
