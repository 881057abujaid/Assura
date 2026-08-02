import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  Layers,
  LifeBuoy,
  CreditCard,
  FolderOpen,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

import { Button, PrismaticBackground } from '../components/ui'

import { ROUTES } from '../config/routes'

import logo from '../assets/logo.png'

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, clearUser } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    clearUser()
    navigate(ROUTES.LOGIN)
  }

  const userRole = user?.role || 'CUSTOMER'
  const isCustomer = userRole === 'CUSTOMER'

  const adminAgentNavItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Customers', path: ROUTES.CUSTOMERS, icon: Users, roles: ['ADMIN', 'AGENT'] },
    { name: 'Policies', path: ROUTES.POLICIES, icon: FileText, roles: ['ADMIN', 'AGENT'] },
    { name: 'Policy Types', path: ROUTES.POLICY_TYPES, icon: Layers, roles: ['ADMIN'] },
    { name: 'Claims', path: ROUTES.CLAIMS, icon: LifeBuoy, roles: ['ADMIN', 'AGENT'] },
    { name: 'Payments', path: ROUTES.PAYMENTS, icon: CreditCard, roles: ['ADMIN', 'AGENT'] },
    { name: 'Documents', path: ROUTES.DOCUMENTS, icon: FolderOpen },
    { name: 'Profile', path: ROUTES.PROFILE, icon: User },
  ]

  const customerNavItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'My Policies', path: ROUTES.MY_POLICIES, icon: FileText },
    { name: 'My Claims', path: ROUTES.MY_CLAIMS, icon: LifeBuoy },
    { name: 'My Documents', path: ROUTES.MY_DOCUMENTS, icon: FolderOpen },
    { name: 'Profile', path: ROUTES.PROFILE, icon: User },
  ]

  const filteredNavItems = isCustomer
    ? customerNavItems
    : adminAgentNavItems.filter(item => {
      if (!item.roles) return true
      return item.roles.includes(userRole)
    })

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-text-primary/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-base border-r border-border-custom flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand/Logo header */}
        <div className="h-20 border-b border-border-custom flex items-center justify-between px-5 bg-bg-base">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Assura Logo" className="h-11 w-auto object-contain shrink-0 scale-[1.4]" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 tracking-tight leading-tight">
                ASSURA
              </span>
              <span className="text-[8px] font-black text-text-primary tracking-wider uppercase leading-none mt-1">
                INSURE • PROTECT • ASSURE
              </span>
            </div>
          </Link>
          <button
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-150 ${isActive
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-white font-bold shadow-md shadow-purple-500/20'
                    : 'text-text-secondary hover:bg-purple-50/50 hover:text-text-primary font-medium'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar header */}
        <header className="h-20 border-b border-border-custom flex items-center justify-between px-6 bg-bg-base/80 backdrop-blur-md sticky top-0 z-30">
          <button
            className="lg:hidden text-text-secondary hover:text-text-primary p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>

          {/* Top Search Input */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-border-custom px-3.5 py-2 rounded-xl w-72 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Search className="h-4 w-4 text-text-secondary shrink-0" />
            <input
              type="text"
              placeholder="Search policies, customers, claims..."
              className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-secondary focus:outline-none font-medium"
            />
          </div>

          {/* User profile dropdown container */}
          <div className="relative ml-auto" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-all duration-150 focus:outline-none border border-transparent hover:border-border-custom"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-text-primary leading-tight">
                  {user?.email || 'User Session'}
                </span>
                <span className="inline-block self-start px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-primary/10 text-primary capitalize leading-none mt-0.5">
                  {userRole.toLowerCase()}
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-primary' : ''
                  }`}
                strokeWidth={2}
              />
            </button>

            {/* Clickable Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-bg-base border border-border-custom rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-border-custom mb-1 bg-slate-50/50 rounded-xl">
                  <p className="text-xs font-bold text-text-primary truncate">
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-text-secondary capitalize mt-0.5">
                    Role: {userRole.toLowerCase()}
                  </p>
                </div>

                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <User className="h-4 w-4" strokeWidth={2} />
                  My Account Profile
                </Link>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/5 transition-all mt-1"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto bg-surface p-6 lg:p-8 relative overflow-hidden">
          <PrismaticBackground />
          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
