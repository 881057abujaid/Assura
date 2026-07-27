import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

/**
 * Main application layout wrapping all authenticated paths.
 * Renders the responsive dashboard layout structure.
 */
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors">
      {/* Navigation Drawer/Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navigation Top Header */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Content Outlet View */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/60 dark:bg-zinc-900/20 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
