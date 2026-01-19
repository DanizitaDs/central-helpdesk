import { TicketCategory } from '@/types/ticket';
import { categoryLabels, cn } from '@/lib/utils';
import { Bug, Lightbulb, HelpCircle, MessageSquare, MoreHorizontal } from 'lucide-react';

interface CategoryBadgeProps {
  category: TicketCategory;
  size?: 'sm' | 'md';
}

const categoryIcons: Record<TicketCategory, React.ReactNode> = {
  bug: <Bug className="w-3 h-3" />,
  feature: <Lightbulb className="w-3 h-3" />,
  support: <HelpCircle className="w-3 h-3" />,
  question: <MessageSquare className="w-3 h-3" />,
  other: <MoreHorizontal className="w-3 h-3" />,
};

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full bg-secondary text-secondary-foreground',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {categoryIcons[category]}
      {categoryLabels[category]}
    </span>
  );
}
