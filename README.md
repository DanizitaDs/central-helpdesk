# Central de Chamados (Helpdesk)

Sistema de gerenciamento de chamados técnicos desenvolvido em React com integração à API REST do Xano.

## 📋 Visão Geral

Este é um sistema completo de helpdesk que permite:

- **Criar chamados** com título, descrição, prioridade, categoria e dados do solicitante
- **Listar chamados** com paginação, filtros e ordenação
- **Editar chamados** existentes com confirmação
- **Excluir chamados** com confirmação
- **Visualizar detalhes** de cada chamado

### Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router DOM v6
- **Backend**: API REST (Xano)

## 🚀 Como Testar

### Pré-requisitos

- Node.js 18+ ou Bun
- npm, yarn ou bun

### Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Navegue até o diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install
# ou
bun install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
bun dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Testes Automatizados

```bash
# Executar testes
npm run test
# ou
bun test
```

## 🔌 Endpoints da API

**Base URL**: `https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL`

### Listar Chamados

```
GET /tickets
```

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `page` | number | Número da página (padrão: 1) |
| `limit` | number | Itens por página (padrão: 10) |
| `q` | string | Busca por ID ou título |
| `status` | string | Filtro por status |
| `priority` | string | Filtro por prioridade |

**Exemplo com cURL:**
```bash
curl -X GET "https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL/tickets?page=1&limit=10"
```

**Exemplo com Insomnia/Postman:**
```
GET https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL/tickets?page=1&limit=10&status=Aberto
```

**Resposta:**
```json
[
  {
    "id": 1,
    "tickets_id": 1,
    "title": "Problema com acesso",
    "description": "Não consigo acessar o sistema",
    "status": "Aberto",
    "priority": "Alta",
    "category": "Acesso",
    "requester_name": "João Silva",
    "requester_email": "joao@email.com",
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": "2025-01-20T10:00:00Z"
  }
]
```

---

### Buscar Chamado por ID

```
GET /tickets/{id}
```

**Exemplo com cURL:**
```bash
curl -X GET "https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL/tickets/1"
```

---

### Criar Chamado

```
POST /tickets
```

**Body (JSON):**
```json
{
  "title": "Título do chamado",
  "description": "Descrição detalhada do problema",
  "status": "Aberto",
  "priority": "Media",
  "category": "Software",
  "requester_name": "Nome do Solicitante",
  "requester_email": "email@exemplo.com"
}
```

**Exemplo com cURL:**
```bash
curl -X POST "https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Erro no sistema",
    "description": "O sistema apresenta erro ao salvar",
    "status": "Aberto",
    "priority": "Alta",
    "category": "Software",
    "requester_name": "Maria Santos",
    "requester_email": "maria@email.com"
  }'
```

---

### Atualizar Chamado

```
PUT /tickets/{id}
```

**Body (JSON) - Todos os campos são obrigatórios:**
```json
{
  "tickets_id": 1,
  "title": "Título atualizado",
  "description": "Descrição atualizada",
  "status": "Em Andamento",
  "priority": "Alta",
  "category": "Software",
  "requester_name": "Nome do Solicitante",
  "requester_email": "email@exemplo.com"
}
```

**Exemplo com cURL:**
```bash
curl -X PUT "https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL/tickets/1" \
  -H "Content-Type: application/json" \
  -d '{
    "tickets_id": 1,
    "title": "Erro no sistema - Resolvido",
    "description": "Problema corrigido após atualização",
    "status": "Resolvido",
    "priority": "Alta",
    "category": "Software",
    "requester_name": "Maria Santos",
    "requester_email": "maria@email.com"
  }'
```

---

### Excluir Chamado

```
DELETE /tickets/{id}
```

**Exemplo com cURL:**
```bash
curl -X DELETE "https://x8ki-letl-twmt.n7.xano.io/api:KC4cuToL/tickets/1"
```

---

## 📊 Valores dos Enums

### Status
| Valor | Descrição |
|-------|-----------|
| `Aberto` | Chamado recém-criado |
| `Em Andamento` | Chamado em análise |
| `Resolvido` | Chamado finalizado |
| `Cancelado` | Chamado cancelado |

### Prioridade
| Valor | Descrição |
|-------|-----------|
| `Baixa` | Prioridade baixa |
| `Media` | Prioridade média |
| `Alta` | Prioridade alta |

### Categoria
| Valor | Descrição |
|-------|-----------|
| `Acesso` | Problemas de acesso/login |
| `Hardware` | Problemas de equipamento |
| `Software` | Problemas de sistema |
| `Rede` | Problemas de conectividade |
| `Outros` | Outros problemas |

---

## 🏗️ Decisões Técnicas

### Arquitetura

1. **Componentização**: Componentes pequenos e reutilizáveis (StatusBadge, PriorityBadge, CategoryBadge) para manter consistência visual.

2. **Separação de Responsabilidades**: 
   - `/services/api.ts` - Comunicação com a API
   - `/types/ticket.ts` - Definição de tipos TypeScript
   - `/components` - Componentes de UI reutilizáveis
   - `/pages` - Páginas/rotas da aplicação

3. **Design System**: Uso de tokens semânticos do Tailwind CSS para temas consistentes (light/dark mode).

### Tratamento de Dados

1. **Normalização**: A função `normalizeTicket()` garante consistência dos dados recebidos da API, tratando variações de nomenclatura (`created_at` vs `createdAt`).

2. **Paginação**: 
   - Frontend envia `page` e `limit` para o backend
   - Backend retorna dados paginados
   - Fallback client-side caso API retorne array simples

3. **Filtros Server-side**: Os parâmetros `q`, `status` e `priority` são enviados ao backend para filtragem eficiente.

### UX/UI

1. **Debounce na Busca**: 300ms de delay para evitar requisições excessivas durante digitação.

2. **Confirmações**: Diálogos de confirmação para ações destrutivas (excluir) e importantes (criar/editar).

3. **Feedback Visual**: 
   - Estados de loading, erro e vazio
   - Badges coloridos por status/prioridade
   - Toast notifications para ações

4. **Responsividade**: Layout adaptativo para desktop e mobile.

### Performance

1. **useCallback**: Memoização de funções para evitar re-renders desnecessários.

2. **Paginação**: Carregamento de apenas 10 itens por página para performance.

---

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── Header.tsx       # Cabeçalho com tema
│   ├── StatusBadge.tsx  # Badge de status
│   ├── PriorityBadge.tsx # Badge de prioridade
│   ├── CategoryBadge.tsx # Badge de categoria
│   ├── Pagination.tsx   # Componente de paginação
│   ├── States.tsx       # Estados (loading, error, empty)
│   └── *Dialog.tsx      # Diálogos de confirmação
├── pages/
│   ├── TicketList.tsx   # Lista de chamados
│   ├── TicketCreate.tsx # Criar chamado
│   ├── TicketEdit.tsx   # Editar chamado
│   └── NotFound.tsx     # Página 404
├── services/
│   └── api.ts           # Serviço de API
├── types/
│   └── ticket.ts        # Tipos TypeScript
├── hooks/
│   └── useTheme.tsx     # Hook de tema
└── lib/
    └── utils.ts         # Utilitários
```

---

## 🔗 Links Úteis

- **Preview**: https://id-preview--da07978f-88db-4682-8a04-4f4c2d06e4d1.lovable.app
- **Produção**: https://central-helpdesk.lovable.app
