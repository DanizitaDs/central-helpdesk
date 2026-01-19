import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { ticketApi } from '@/services/api';
import { Ticket, TicketStatus, TicketPriority } from '@/types/ticket';
import { formatDateTime } from '@/lib/utils';
import { Header } from '@/components/Header';
import { LoadingState, ErrorState } from '@/components/States';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function TicketEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [status, setStatus] = useState<TicketStatus>('open');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await ticketApi.getById(id);
        if (data) {
          setTicket(data);
          setStatus(data.status);
          setPriority(data.priority);
        } else {
          setError('Chamado não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar chamado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicket();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await ticketApi.update({
        id,
        status,
        priority,
      });
      
      toast.success('Chamado atualizado com sucesso!');
      navigate('/');
    } catch (err) {
      toast.error('Erro ao atualizar chamado');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      await ticketApi.delete(id);
      toast.success('Chamado excluído com sucesso!');
      navigate('/');
    } catch (err) {
      toast.error('Erro ao excluir chamado');
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para lista
        </Button>

        {loading ? (
          <LoadingState message="Carregando chamado..." />
        ) : error ? (
          <ErrorState 
            title="Chamado não encontrado"
            description={error}
          />
        ) : ticket ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Ticket Info Card */}
            <div className="bg-card rounded-xl border shadow-card p-6 md:p-8 mb-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">{ticket.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <CategoryBadge category={ticket.category} />
                </div>
                <p className="text-muted-foreground">{ticket.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-4">
                <div>
                  <span className="font-medium text-foreground">Criado em:</span>{' '}
                  {formatDateTime(ticket.createdAt)}
                </div>
                <div>
                  <span className="font-medium text-foreground">Atualizado em:</span>{' '}
                  {formatDateTime(ticket.updatedAt)}
                </div>
              </div>
            </div>

            {/* Edit Form Card */}
            <div className="bg-card rounded-xl border shadow-card p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Editar Chamado</h2>
                <p className="text-muted-foreground">Atualize o status e prioridade do chamado.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as TicketStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Aberto</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir Chamado
                  </Button>
                  
                  <div className="flex gap-3 flex-1 md:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        ) : null}
      </main>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
