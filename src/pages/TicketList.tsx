import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { ticketApi } from '@/services/api';
import { Ticket, TicketFilters, TicketStatus, TicketPriority } from '@/types/ticket';
import { useDebounce, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Pagination } from '@/components/Pagination';
import { Header } from '@/components/Header';
import { LoadingState, EmptyState, ErrorState } from '@/components/States';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { TicketViewDialog } from '@/components/TicketViewDialog';
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

const ITEMS_PER_PAGE = 10;

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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // View state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [ticketToView, setTicketToView] = useState<Ticket | null>(null);

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
      { status: statusFilter, priority: priorityFilter, search: query, sortOrder },
      1
    );
  }, 300);

  useEffect(() => {
    fetchTickets({ status: statusFilter, priority: priorityFilter, search: searchQuery, sortOrder }, currentPage);
  }, [statusFilter, priorityFilter, currentPage, sortOrder]);

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

  const handleView = (ticket: Ticket) => {
    setTicketToView(ticket);
    setViewDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    
    setIsDeleting(true);
    try {
      await ticketApi.delete(ticketToDelete);
      toast.success('Chamado excluído com sucesso!');
      fetchTickets({ status: statusFilter, priority: priorityFilter, search: searchQuery, sortOrder }, currentPage);
    } catch (err) {
      toast.error('Erro ao excluir chamado');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chamados</h1>
            <p className="text-muted-foreground">
              {loading ? 'Carregando...' : `${total} chamado${total !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Button onClick={() => navigate('/create')} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Chamado
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID ou título..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as TicketStatus | 'all'); setCurrentPage(1); }}>
                <SelectTrigger className="w-44 bg-secondary border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Resolvido">Resolvido</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={(value) => { setPriorityFilter(value as TicketPriority | 'all'); setCurrentPage(1); }}>
                <SelectTrigger className="w-44 bg-secondary border-border">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Prioridades</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Media">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={toggleSort} className="gap-2 border-border">
                {sortOrder === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                {sortOrder === 'newest' ? 'Mais Recentes' : 'Mais Antigos'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <LoadingState message="Carregando chamados..." />
          ) : error ? (
            <ErrorState 
              onRetry={() => fetchTickets({ status: statusFilter, priority: priorityFilter, search: searchQuery, sortOrder }, currentPage)} 
            />
          ) : tickets.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="text-left text-sm font-semibold text-muted-foreground px-6 py-4">ID</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground px-6 py-4">Título</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground px-6 py-4">Status</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground px-6 py-4">Prioridade</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground px-6 py-4">Categoria</th>
                      <th className="text-left text-sm font-semibold text-muted-foreground px-6 py-4">Data</th>
                      <th className="text-right text-sm font-semibold text-muted-foreground px-6 py-4">Ações</th>
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
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-muted-foreground font-mono">#{ticket.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground line-clamp-1 max-w-xs">{ticket.title}</p>
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
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(ticket)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/edit/${ticket.id}`)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(ticket.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
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

              {totalPages > 1 && (
                <div className="border-t border-border px-6 py-4">
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

      <TicketViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        ticket={ticketToView}
      />
    </div>
  );
}