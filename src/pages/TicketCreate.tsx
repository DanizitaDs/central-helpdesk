import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Mail } from 'lucide-react';
import { ticketApi } from '@/services/api';
import { TicketStatus, TicketPriority } from '@/types/ticket';
import { validateTitle, validateDescription, validateEmail, validateName } from '@/lib/utils';
import { Header } from '@/components/Header';
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
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus>('Aberto');
  const [priority, setPriority] = useState<TicketPriority>('Media');
  const [category, setCategory] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    const titleError = validateTitle(title);
    const descError = validateDescription(description);
    const nameError = validateName(requesterName);
    const emailError = validateEmail(requesterEmail);
    
    if (titleError) newErrors.title = titleError;
    if (descError) newErrors.description = descError;
    if (nameError) newErrors.requesterName = nameError;
    if (emailError) newErrors.requesterEmail = emailError;
    if (!category.trim()) newErrors.category = 'A categoria é obrigatória';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
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
          <div className="bg-card rounded-xl border border-border shadow-card p-6 md:p-8">
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
                  placeholder="Digite o título do chamado (5-80 caracteres)"
                  className={errors.title ? 'border-destructive' : ''}
                />
                <div className="flex justify-between text-sm">
                  {errors.title ? (
                    <span className="text-destructive">{errors.title}</span>
                  ) : (
                    <span className="text-muted-foreground">Mínimo 5, máximo 80 caracteres</span>
                  )}
                  <span className={`${title.length > 80 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {title.length}/80
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
                    <span className="text-muted-foreground">Máximo 2000 caracteres</span>
                  )}
                  <span className={`${description.length > 2000 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {description.length}/2000
                  </span>
                </div>
              </div>

              {/* Category, Priority, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Categoria <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Suporte, Hardware"
                    className={errors.category ? 'border-destructive' : ''}
                  />
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
                      <SelectItem value="Critica">Crítica</SelectItem>
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
                      <SelectItem value="Fechado">Fechado</SelectItem>
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
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Criando...' : 'Criar Chamado'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
