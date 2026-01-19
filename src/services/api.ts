import { 
  Ticket, 
  TicketCreateInput, 
  TicketUpdateInput, 
  PaginatedResponse, 
  TicketFilters,
  TicketStatus,
  TicketPriority,
  TicketCategory
} from '@/types/ticket';

// Mock data for demonstration
const generateMockTickets = (): Ticket[] => {
  const statuses: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
  const priorities: TicketPriority[] = ['low', 'medium', 'high', 'critical'];
  const categories: TicketCategory[] = ['bug', 'feature', 'support', 'question', 'other'];
  
  const titles = [
    'Login não funciona após atualização',
    'Adicionar modo escuro ao dashboard',
    'Erro ao exportar relatório PDF',
    'Dúvida sobre integração com API',
    'Botão de salvar não responde',
    'Melhorar performance da busca',
    'Problema com upload de imagens',
    'Solicitar nova funcionalidade de filtros',
    'Erro 500 ao acessar perfil',
    'Atualizar documentação da API',
    'Notificações não chegam por email',
    'Implementar autenticação 2FA',
    'Bug no formulário de cadastro',
    'Relatório de vendas incorreto',
    'Adicionar suporte a múltiplos idiomas',
  ];

  return titles.map((title, index) => ({
    id: `ticket-${index + 1}`,
    title,
    description: `Descrição detalhada do chamado: ${title}. Este é um texto de exemplo para demonstrar o sistema de helpdesk.`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

let mockTickets = generateMockTickets();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const ticketApi = {
  async getAll(
    page: number = 1, 
    limit: number = 10, 
    filters?: TicketFilters
  ): Promise<PaginatedResponse<Ticket>> {
    await delay(500); // Simulate network delay
    
    let filtered = [...mockTickets];
    
    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    
    if (filters?.priority && filters.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getById(id: string): Promise<Ticket | null> {
    await delay(300);
    return mockTickets.find(t => t.id === id) || null;
  },

  async create(input: TicketCreateInput): Promise<Ticket> {
    await delay(400);
    
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockTickets = [newTicket, ...mockTickets];
    return newTicket;
  },

  async update(input: TicketUpdateInput): Promise<Ticket> {
    await delay(400);
    
    const index = mockTickets.findIndex(t => t.id === input.id);
    if (index === -1) {
      throw new Error('Chamado não encontrado');
    }
    
    mockTickets[index] = {
      ...mockTickets[index],
      status: input.status,
      priority: input.priority,
      updatedAt: new Date().toISOString(),
    };
    
    return mockTickets[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    
    const index = mockTickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Chamado não encontrado');
    }
    
    mockTickets = mockTickets.filter(t => t.id !== id);
  },
};
