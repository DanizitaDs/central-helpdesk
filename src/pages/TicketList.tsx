import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { ticketApi } from '@/services/api';
import { Ticket, TicketFilters, TicketStatus, TicketPriority } from '@/types/ticket';
import { useDebounce, formatDate, statusLabels, priorityLabels } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Pagination } from '@/components/Pagination';
import { Header } from '@/components/Header';
import { LoadingState, EmptyState, ErrorState } from '@/components/States';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

export default function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTickets = useCallback(async (filters: TicketFilters, page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketApi.getAll(page, ITEMS_PER_PAGE, filters);
      setTickets(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err) {
      setError('Erro ao carregar chamados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedFetch = useDebounce((query: string) => {
    fetchTickets(
      { status: statusFilter, priority: priorityFilter, search: query },
      1
    );
  }, 300);

  useEffect(() => {
    fetchTickets({ status: statusFilter, priority: priorityFilter, search: searchQuery }, currentPage);
  }, [statusFilter, priorityFilter, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedFetch(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: string) => {
    setTicketToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    
    setIsDeleting(true);
    try {
      await ticketApi.delete(ticketToDelete);
      toast.success('Chamado excluído com sucesso!');
      fetchTickets({ status: statusFilter, priority: priorityFilter, search: searchQuery }, currentPage);
    } catch (err) {
      toast.error('Erro ao excluir chamado');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lista de Chamados</h1>
            <p className="text-muted-foreground">
              {loading ? 'Carregando...' : `${total} chamado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Button onClick={() => navigate('/create')} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Chamado
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Prioridades</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          {loading ? (
            <LoadingState message="Carregando chamados..." />
          ) : error ? (
            <ErrorState 
              onRetry={() => fetchTickets({ status: statusFilter, priority: priorityFilter, search: searchQuery }, currentPage)} 
            />
          ) : tickets.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Título</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Status</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Prioridade</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Categoria</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Data</th>
                      <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {tickets.map((ticket, index) => (
                        <motion.tr
                          key={ticket.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="font-medium text-foreground truncate">{ticket.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{ticket.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={ticket.status} size="sm" />
                          </td>
                          <td className="px-6 py-4">
                            <PriorityBadge priority={ticket.priority} size="sm" />
                          </td>
                          <td className="px-6 py-4">
                            <CategoryBadge category={ticket.category} size="sm" />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(ticket.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/edit/${ticket.id}`)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(ticket.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t px-6 py-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
