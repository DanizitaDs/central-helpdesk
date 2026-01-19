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
    
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    
    if (filters?.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    const response = await fetch(`${API_BASE_URL}/tickets?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar chamados');
    }
    
    const data = await response.json();
    
    // Handle both paginated response and array response from Xano
    if (Array.isArray(data)) {
      // If API returns array, handle pagination client-side
      let filtered = [...data];
      
      // Apply client-side filters if API doesn't support them
      if (filters?.status && filters.status !== 'all') {
        filtered = filtered.filter(t => t.status === filters.status);
      }
      
      if (filters?.priority && filters.priority !== 'all') {
        filtered = filtered.filter(t => t.priority === filters.priority);
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.title?.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
        );
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
        status: input.status,
        priority: input.priority,
        category: input.category,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar chamado');
    }
    
    const data = await response.json();
    return normalizeTicket(data);
  },

  async update(input: TicketUpdateInput): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/${input.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: input.id,
        status: input.status,
        priority: input.priority,
      }),
    });
    
    if (!response.ok) {
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

// Normalize ticket data from API to match our Ticket type
function normalizeTicket(data: any): Ticket {
  return {
    id: String(data.id),
    title: data.title || '',
    description: data.description || '',
    status: data.status || 'open',
    priority: data.priority || 'medium',
    category: data.category || 'other',
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
  };
}
