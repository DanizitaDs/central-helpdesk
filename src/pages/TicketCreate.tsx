import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { ticketApi } from '@/services/api';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';
import { validateTitle, validateDescription, statusLabels, priorityLabels, categoryLabels } from '@/lib/utils';
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
  const [status, setStatus] = useState<TicketStatus>('open');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [category, setCategory] = useState<TicketCategory>('support');
  
  // Error state
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);
    
    if (titleError || descriptionError) {
      setErrors({ title: titleError || undefined, description: descriptionError || undefined });
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
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista
          </Button>

          {/* Form Card */}
          <div className="bg-card rounded-xl border shadow-card p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Criar Novo Chamado</h1>
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
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">Funcionalidade</SelectItem>
                      <SelectItem value="support">Suporte</SelectItem>
                      <SelectItem value="question">Dúvida</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
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
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
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
    </div>
  );
}
