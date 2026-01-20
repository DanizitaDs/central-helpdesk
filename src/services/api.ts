import { 
  Ticket, 
  TicketCreateInput, 
  TicketUpdateInput, 
  PaginatedResponse, 
  TicketFilters
} from '@/types/ticket';

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL';

// API Functions
export const ticketApi = {
  async getAll(
    page: number = 1, 
    limit: number = 10, 
    filters?: TicketFilters
  ): Promise<PaginatedResponse<Ticket>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Add search query parameter
    if (filters?.search && filters.search.trim()) {
      params.append('q', filters.search.trim());
    }
    
    // Add status filter parameter
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    
    // Add priority filter parameter
    if (filters?.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    
    const response = await fetch(`${API_BASE_URL}/tickets?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar chamados');
    }
    
    const data = await response.json();
    
    // Handle both paginated response and array response from Xano
    if (Array.isArray(data)) {
      let filtered = [...data];
      
      // Sort by date (client-side since API might not support it)
      if (filters?.sortOrder) {
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt).getTime();
          const dateB = new Date(b.created_at || b.createdAt).getTime();
          return filters.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
      }
      
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedData = filtered.slice(start, start + limit);
      
      return {
        data: paginatedData.map(normalizeTicket),
        total,
        page,
        limit,
        totalPages,
      };
    }
    
    // If API returns paginated object
    return {
      data: (data.items || data.data || []).map(normalizeTicket),
      total: data.total || data.itemsTotal || 0,
      page: data.page || page,
      limit: data.limit || data.perPage || limit,
      totalPages: data.totalPages || data.pageTotal || 1,
    };
  },

  async getById(id: string): Promise<Ticket | null> {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Erro ao carregar chamado');
    }
    
    const data = await response.json();
    return normalizeTicket(data);
  },

  async create(input: TicketCreateInput): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: input.title,
        description: input.description,
        status: input.status || 'Aberto',
        priority: input.priority,
        category: input.category,
        requester_name: input.requester_name,
        requester_email: input.requester_email,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar chamado');
    }
    
    const data = await response.json();
    return normalizeTicket(data);
  },

  async update(input: TicketUpdateInput): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/${input.tickets_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tickets_id: input.tickets_id,
        title: input.title,
        description: input.description,
        status: input.status,
        category: input.category,
        priority: input.priority,
        requester_name: input.requester_name,
        requester_email: input.requester_email,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error updating ticket:', errorData);
      throw new Error('Erro ao atualizar chamado');
    }
    
    const data = await response.json();
    return normalizeTicket(data);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao excluir chamado');
    }
  },
};

// Normalize ticket data from API
function normalizeTicket(data: any): Ticket {
  return {
    id: String(data.id || data.tickets_id),
    tickets_id: data.tickets_id || data.id,
    title: data.title || '',
    description: data.description || '',
    status: data.status || 'Aberto',
    priority: data.priority || 'Media',
    category: data.category || 'Outros',
    requester_name: data.requester_name || '',
    requester_email: data.requester_email || '',
    created_at: data.created_at || data.createdAt || new Date().toISOString(),
    updated_at: data.updated_at || data.updatedAt || new Date().toISOString(),
  };
}
