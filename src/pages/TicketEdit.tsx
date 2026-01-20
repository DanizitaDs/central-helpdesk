import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Mail } from 'lucide-react';
import { ticketApi } from '@/services/api';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';
import { formatDateTime, validateTitle, validateDescription, validateEmail, validateName } from '@/lib/utils';
import { Header } from '@/components/Header';
import { LoadingState, ErrorState } from '@/components/States';
import { StatusBadge } from '@/components/StatusBadge';

import { EditConfirmDialog } from '@/components/EditConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  
  // Form state - all editable fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus>('Aberto');
  const [category, setCategory] = useState<TicketCategory | string>('Acesso');
  const [priority, setPriority] = useState<TicketPriority>('Media');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Dialog states
  const [editConfirmDialogOpen, setEditConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await ticketApi.getById(id);
        if (data) {
          setTicket(data);
          // Pre-fill all form fields
          setTitle(data.title);
          setDescription(data.description);
          setStatus(data.status);
          setCategory(data.category || 'Acesso');
          setPriority(data.priority);
          setRequesterName(data.requester_name || '');
          setRequesterEmail(data.requester_email || '');
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const titleError = validateTitle(title);
    const descError = validateDescription(description);
    const nameError = validateName(requesterName);
    const emailError = validateEmail(requesterEmail);
    
    if (titleError) newErrors.title = titleError;
    if (descError) newErrors.description = descError;
    if (nameError) newErrors.requesterName = nameError;
    if (emailError) newErrors.requesterEmail = emailError;
    if (!category) newErrors.category = 'A categoria é obrigatória';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !ticket) return;
    
    if (validateForm()) {
      setEditConfirmDialogOpen(true);
    }
  };

  const handleConfirmEdit = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await ticketApi.update({
        tickets_id: Number(id),
        title,
        description,
        status,
        category: category as string,
        priority,
        requester_name: requesterName,
        requester_email: requesterEmail,
      });
      
      toast.success('Chamado atualizado com sucesso!');
      setEditConfirmDialogOpen(false);
      navigate('/');
    } catch (err) {
      toast.error('Erro ao atualizar chamado');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
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
            {/* Header with badges */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-muted-foreground text-sm">#{ticket.id}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{ticket.title}</h1>
              <p className="text-muted-foreground mt-2">
                Criado em {formatDateTime(ticket.created_at)}
              </p>
            </div>

            {/* Edit Form Card */}
            <div className="bg-card rounded-xl border border-border p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Editar Chamado</h2>
                <p className="text-muted-foreground">Atualize os campos abaixo.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do chamado"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <span className="text-sm text-destructive">{errors.title}</span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descrição <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o problema ou solicitação"
                    rows={4}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <span className="text-sm text-destructive">{errors.description}</span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {description.length}/2000
                  </span>
                </div>

                {/* Status, Category & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as TicketStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aberto">Aberto</SelectItem>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Resolvido">Resolvido</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Categoria <span className="text-destructive">*</span>
                    </Label>
                    <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)}>
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acesso">Acesso</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Rede">Rede</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <span className="text-sm text-destructive">{errors.category}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Media">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Requester Info */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações do Solicitante
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requesterName">
                        Nome <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="requesterName"
                        value={requesterName}
                        onChange={(e) => setRequesterName(e.target.value)}
                        placeholder="Nome do solicitante"
                        className={errors.requesterName ? 'border-destructive' : ''}
                      />
                      {errors.requesterName && (
                        <span className="text-sm text-destructive">{errors.requesterName}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requesterEmail">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="requesterEmail"
                          type="email"
                          value={requesterEmail}
                          onChange={(e) => setRequesterEmail(e.target.value)}
                          placeholder="email@exemplo.com"
                          className={`pl-10 ${errors.requesterEmail ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {errors.requesterEmail && (
                        <span className="text-sm text-destructive">{errors.requesterEmail}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-border justify-end">
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
              </form>
            </div>
          </motion.div>
        ) : null}
      </main>


      <EditConfirmDialog
        open={editConfirmDialogOpen}
        onOpenChange={setEditConfirmDialogOpen}
        onConfirm={handleConfirmEdit}
        isLoading={isSubmitting}
        title="Confirmar Alterações"
        description={`Deseja realmente salvar as alterações no chamado "${title}"?`}
      />
    </div>
  );
}