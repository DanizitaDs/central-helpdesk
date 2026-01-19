import { TicketCategory } from '@/types/ticket';
import { categoryLabels, cn } from '@/lib/utils';
import { Bug, Lightbulb, HelpCircle, MessageSquare, MoreHorizontal } from 'lucide-react';

interface CategoryBadgeProps {
  category: TicketCategory | string | null | undefined;
  size?: 'sm' | 'md';
}

const categoryIcons: Record<string, React.ReactNode> = {
  bug: <Bug className="w-3 h-3" />,
  feature: <Lightbulb className="w-3 h-3" />,
  support: <HelpCircle className="w-3 h-3" />,
  question: <MessageSquare className="w-3 h-3" />,
  other: <MoreHorizontal className="w-3 h-3" />,
};

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const normalizedCategory = category || 'other';
  const icon = categoryIcons[normalizedCategory] || categoryIcons.other;
  const label = categoryLabels[normalizedCategory] || normalizedCategory;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full bg-secondary text-secondary-foreground',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {icon}
      {label}
    </span>
  );
}
