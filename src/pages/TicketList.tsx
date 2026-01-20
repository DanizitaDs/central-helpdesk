import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ticketApi } from '@/services/api';
import { Ticket, TicketStatus, TicketPriority, TicketFilters } from '@/types/ticket';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { TicketViewDialog } from '@/components/TicketViewDialog';
import { Pagination } from '@/components/Pagination';
import { EmptyState, LoadingState, ErrorState } from '@/components/States';
import { formatDate } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

export default function TicketList() {
  const navigate = useNavigate();
  
  // Data state
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
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: TicketFilters = {
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
        sortOrder,
      };
      fetchTickets(filters, 1);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [statusFilter, priorityFilter, searchQuery, sortOrder, fetchTickets]);

  const handlePageChange = (page: number) => {
    const filters: TicketFilters = {
      status: statusFilter,
      priority: priorityFilter,
      search: searchQuery,
      sortOrder,
    };
    fetchTickets(filters, page);
  };

  const handleDelete = async () => {
    if (!ticketToDelete) return;
    
    try {
      await ticketApi.delete(ticketToDelete.id);
      const filters: TicketFilters = {
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
        sortOrder,
      };
      fetchTickets(filters, currentPage);
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  const openDeleteDialog = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const openViewDialog = (ticket: Ticket) => {
    setTicketToView(ticket);
    setViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chamados</h1>
            <p className="text-muted-foreground mt-1">
              {total} chamado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => navigate('/tickets/create')} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Chamado
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID ou título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Aberto">Aberto</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Media">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}
            >
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="oldest">Mais Antigos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState description={error} onRetry={() => handlePageChange(currentPage)} />
        ) : tickets.length === 0 ? (
          <EmptyState
            title="Nenhum chamado encontrado"
            description="Crie um novo chamado para começar."
          />
        ) : (
          <>
            {/* Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-28">Prioridade</TableHead>
                    <TableHead className="w-28">Categoria</TableHead>
                    <TableHead className="w-32">Criado em</TableHead>
                    <TableHead className="w-32 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">
                        #{ticket.tickets_id ?? ticket.id}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {ticket.title}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <CategoryBadge category={ticket.category} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(ticket.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openViewDialog(ticket)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/tickets/${ticket.tickets_id ?? ticket.id}/edit`)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(ticket)}
                            title="Excluir"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}

        {/* Dialogs */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Excluir Chamado"
          description={`Tem certeza que deseja excluir o chamado "${ticketToDelete?.title}"? Esta ação não pode ser desfeita.`}
        />

        <TicketViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          ticket={ticketToView}
        />
      </div>
    </div>
  );
}
