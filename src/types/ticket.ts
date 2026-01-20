export type TicketStatus = 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Cancelado';
export type TicketPriority = 'Baixa' | 'Media' | 'Alta';
export type TicketCategory = 'Acesso' | 'Hardware' | 'Software' | 'Rede' | 'Outros';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory | string;
  requester_name?: string;
  requester_email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketCreateInput {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory | string;
  requester_name: string;
  requester_email: string;
}

export interface TicketUpdateInput {
  tickets_id: number;
  title: string;
  description: string;
  status: TicketStatus;
  category: string;
  priority: string;
  requester_name: string;
  requester_email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketFilters {
  status?: TicketStatus[] | 'all';
  priority?: TicketPriority | 'all';
  search?: string;
  sortOrder?: 'newest' | 'oldest';
}
