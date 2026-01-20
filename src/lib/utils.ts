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

// Status labels - Portuguese values from API (sem acento)
export const statusLabels: Record<string, string> = {
  'Aberto': 'Aberto',
  'Em Andamento': 'Em Andamento',
  'Resolvido': 'Resolvido',
  'Fechado': 'Fechado',
  'all': 'Todos',
};

// Priority labels - Portuguese values from API (sem acento)
export const priorityLabels: Record<string, string> = {
  'Baixa': 'Baixa',
  'Media': 'Média',
  'Alta': 'Alta',
  'Critica': 'Crítica',
  'all': 'Todas',
};

// Category labels
export const categoryLabels: Record<string, string> = {
  'Bug': 'Bug',
  'Funcionalidade': 'Funcionalidade',
  'Suporte': 'Suporte',
  'Duvida': 'Dúvida',
  'Outro': 'Outro',
  'Acesso': 'Acesso',
  'Hardware': 'Hardware',
  'Software': 'Software',
  'Rede': 'Rede',
};

// Validation helpers with dynamic limits
export function validateTitle(title: string, limits?: { min: number; max: number }): string | null {
  const min = limits?.min ?? 5;
  const max = limits?.max ?? 80;
  
  if (!title.trim()) return 'O título é obrigatório';
  if (title.length < min) return `O título deve ter no mínimo ${min} caracteres`;
  if (title.length > max) return `O título deve ter no máximo ${max} caracteres`;
  return null;
}

export function validateDescription(description: string, limits?: { min: number; max: number }): string | null {
  const min = limits?.min ?? 0;
  const max = limits?.max ?? 2000;
  
  if (!description.trim()) return 'A descrição é obrigatória';
  if (min > 0 && description.length < min) return `A descrição deve ter no mínimo ${min} caracteres`;
  if (description.length > max) return `A descrição deve ter no máximo ${max} caracteres`;
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'O email é obrigatório';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email inválido';
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'O nome é obrigatório';
  if (name.length < 2) return 'O nome deve ter no mínimo 2 caracteres';
  return null;
}
