import { Link, useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projets',
  '/tasks': 'Tâches',
  '/notifications': 'Notifications',
};

function Header() {
  const { pathname } = useLocation();
  const title = Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'TaskFlow';

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
      <h1 className="text-[15px] font-semibold text-gray-900">{title}</h1>

      <Link
        to="/notifications"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </Link>
    </header>
  );
}

export default Header;