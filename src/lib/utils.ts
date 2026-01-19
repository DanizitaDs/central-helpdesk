import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useCallback, useRef } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce hook
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

// Format date to locale string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format date with time
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Status labels - support both English and Portuguese values from API
export const statusLabels: Record<string, string> = {
  open: 'Aberto',
  in_progress: 'Em Andamento',
  resolved: 'Resolvido',
  closed: 'Fechado',
  all: 'Todos',
  // Portuguese values from API
  'Aberto': 'Aberto',
  'Em Andamento': 'Em Andamento',
  'Resolvido': 'Resolvido',
  'Fechado': 'Fechado',
};

// Priority labels - support both English and Portuguese values from API
export const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
  all: 'Todas',
  // Portuguese values from API
  'Baixa': 'Baixa',
  'Média': 'Média',
  'Alta': 'Alta',
  'Crítica': 'Crítica',
};

// Category labels - support various values from API
export const categoryLabels: Record<string, string> = {
  bug: 'Bug',
  feature: 'Funcionalidade',
  support: 'Suporte',
  question: 'Dúvida',
  other: 'Outro',
  // Portuguese/custom values from API
  'Bug': 'Bug',
  'Funcionalidade': 'Funcionalidade',
  'Suporte': 'Suporte',
  'Dúvida': 'Dúvida',
  'Outro': 'Outro',
  'Acesso': 'Acesso',
  'Hardware': 'Hardware',
  'Software': 'Software',
  'Rede': 'Rede',
};

// Validation helpers
export function validateTitle(title: string): string | null {
  if (!title.trim()) return 'O título é obrigatório';
  if (title.length < 5) return 'O título deve ter no mínimo 5 caracteres';
  if (title.length > 80) return 'O título deve ter no máximo 80 caracteres';
  return null;
}

export function validateDescription(description: string): string | null {
  if (!description.trim()) return 'A descrição é obrigatória';
  if (description.length > 2000) return 'A descrição deve ter no máximo 2000 caracteres';
  return null;
}
