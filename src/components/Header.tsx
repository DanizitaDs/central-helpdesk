import { HeadsetIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-glow">
              <HeadsetIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">HelpDesk</h1>
              <p className="text-xs text-muted-foreground">Sistema de Chamados</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                location.pathname === '/'
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              Chamados
            </Link>
            <Link
              to="/create"
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                location.pathname === '/create'
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              Novo Chamado
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
