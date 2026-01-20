import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Mail } from 'lucide-react';
import { ticketApi } from '@/services/api';
import { TicketStatus, TicketPriority, TicketCategory, ValidationLimits } from '@/types/ticket';
import { validateTitle, validateDescription, validateEmail, validateName } from '@/lib/utils';
import { Header } from '@/components/Header';
import { CreateConfirmDialog } from '@/components/CreateConfirmDialog';
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

export default function TicketCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation limits from API
  const [validationLimits, setValidationLimits] = useState<ValidationLimits>({
    title: { min: 5, max: 80 },
    description: { min: 10, max: 2000 },
  });
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus>('Aberto');
  const [priority, setPriority] = useState<TicketPriority>('Media');
  const [category, setCategory] = useState<TicketCategory>('Acesso');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Confirm dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Fetch validation limits from API
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const limits = await ticketApi.getValidationLimits();
        setValidationLimits(limits);
      } catch (err) {
        console.warn('Usando limites de validação padrão');
      }
    };
    fetchLimits();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const titleError = validateTitle(title, validationLimits.title);
    const descError = validateDescription(description, validationLimits.description);
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
    
    if (validateForm()) {
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmCreate = async () => {
    setIsSubmitting(true);
    
    try {
      await ticketApi.create({
        title,
        description,
        status,
        priority,
        category,
        requester_name: requesterName,
        requester_email: requesterEmail,
      });
      
      toast.success('Chamado criado com sucesso!');
      setConfirmDialogOpen(false);
      navigate('/');
    } catch (err) {
      toast.error('Erro ao criar chamado');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista
          </Button>

          {/* Form Card */}
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Novo Chamado</h1>
              <p className="text-muted-foreground">Preencha os campos abaixo para abrir um novo chamado.</p>
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
                  placeholder={`Digite o título do chamado (${validationLimits.title.min}-${validationLimits.title.max} caracteres)`}
                  className={errors.title ? 'border-destructive' : ''}
                />
                <div className="flex justify-between text-sm">
                  {errors.title ? (
                    <span className="text-destructive">{errors.title}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Mínimo {validationLimits.title.min}, máximo {validationLimits.title.max} caracteres
                    </span>
                  )}
                  <span className={`${title.length > validationLimits.title.max ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {title.length}/{validationLimits.title.max}
                  </span>
                </div>
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
                  placeholder="Descreva o problema ou solicitação em detalhes..."
                  rows={5}
                  className={errors.description ? 'border-destructive' : ''}
                />
                <div className="flex justify-between text-sm">
                  {errors.description ? (
                    <span className="text-destructive">{errors.description}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      {validationLimits.description.min > 0 
                        ? `Mínimo ${validationLimits.description.min}, máximo ${validationLimits.description.max} caracteres`
                        : `Máximo ${validationLimits.description.max} caracteres`}
                    </span>
                  )}
                  <span className={`${description.length > validationLimits.description.max ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {description.length}/{validationLimits.description.max}
                  </span>
                </div>
              </div>

              {/* Category, Priority, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Submit Button */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Criando...' : 'Criar Chamado'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      <CreateConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmCreate}
        isLoading={isSubmitting}
        title="Confirmar Criação"
        description={`Deseja realmente criar o chamado "${title}"?`}
      />
    </div>
  );
}