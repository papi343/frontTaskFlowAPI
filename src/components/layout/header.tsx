import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../../Hooks/useNotifications';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projets',
  '/tasks': 'Tâches',
  '/notifications': 'Notifications',
};

function Header({ onOpenMobileMenu }: HeaderProps) {
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();

  let title = 'TaskFlow';
  let subtitle = '';

  if (pathname === '/dashboard') {
    title = 'Dashboard';
    subtitle = "Vue d'ensemble";
  } else if (pathname.startsWith('/projects/')) {
    title = 'Projet';
    subtitle = 'Détails & tâches';
  } else if (pathname === '/projects') {
    title = 'Projets';
    subtitle = 'Gestion des espaces';
  } else if (pathname === '/tasks') {
    title = 'Tâches';
    subtitle = 'Toutes vos actions';
  } else if (pathname === '/notifications') {
    title = 'Notifications';
    subtitle = 'Flux d’activité';
  } else {
    title = Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'TaskFlow';
  }

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Ouvrir le menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && (
              <>
                <span className="text-slate-300 text-xs hidden sm:inline">/</span>
                <span className="text-xs text-slate-500 font-normal hidden sm:inline">{subtitle}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          to="/projects"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-xs"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Nouveau projet</span>
        </Link>

        <Link
          to="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          aria-label="Voir les notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;