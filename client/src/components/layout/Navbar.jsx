import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, HelpCircle } from 'lucide-react';
import { routesConfig } from '../../config/routes';

/**
 * Retrieves the page title from route metadata
 * @param {string} pathname
 */
function getPageTitle(pathname) {
  const matchedRoute = routesConfig.find(route => route.path === pathname);
  return matchedRoute ? matchedRoute.title : 'Assura Core';
}

/**
 * Top portal navigation header.
 * Intercepts active route descriptors for page headers and renders search indicators.
 */
export function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Left side: Mobile Toggle & Page Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0 tracking-tight">
          {pageTitle}
        </h2>
      </div>

      {/* Right side: Search, Notifications, Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar - hidden on mobile */}
        <div className="hidden md:flex items-center relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="search"
            placeholder="Search files, claims, policies..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-zinc-900/60 border border-transparent dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 transition-all duration-200"
          />
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 relative transition-colors cursor-pointer"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 dark:bg-indigo-500 rounded-full ring-2 ring-white dark:ring-zinc-950" />
        </button>

        {/* Support Help Button */}
        <button
          type="button"
          className="hidden sm:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
