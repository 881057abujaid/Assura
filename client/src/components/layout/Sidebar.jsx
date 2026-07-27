import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  ShieldCheck,
  Menu,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../features/auth/services/auth.service';
import { storage } from '../../lib/storage';
import { navigationConfig } from '../../config/navigation';

/**
 * Premium navigation Sidebar for Assura portal layout.
 * Supports active route indicator highlights, maps configurations dynamically,
 * and triggers global logout operations.
 */
export function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  
  // Retrieve user session info using our storage helper
  const user = storage.getUser() || { name: 'Assura Admin', email: 'admin@assura.com' };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 
        bg-slate-900 border-r border-slate-800 text-slate-300
        transform lg:transform-none lg:static transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header / Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-indigo-400/20">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-wider">ASSURA</span>
          </div>
          
          <button 
            type="button" 
            onClick={toggleSidebar} 
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white focus:outline-hidden hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items - Dynamically Mapped */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigationConfig.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id || item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-xs' 
                    : 'hover:bg-slate-800/60 hover:text-white border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.title}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>

        {/* User Session Profile & Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold border border-purple-400/20">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-900/40 text-slate-400 text-xs font-medium rounded-lg border border-slate-800 transition duration-200 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
