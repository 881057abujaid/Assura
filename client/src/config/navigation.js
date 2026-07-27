import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity, 
  FolderLock, 
  CreditCard 
} from 'lucide-react';

/**
 * Sidebar Navigation Links Configuration
 * Defines paths, display labels, and associated Lucide icons.
 */
export const navigationConfig = [
  { id: 'dashboard', title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'customers', title: 'Customers', path: '/customers', icon: Users },
  { id: 'policies', title: 'Policies', path: '/policies', icon: FileText },
  { id: 'claims', title: 'Claims', path: '/claims', icon: Activity },
  { id: 'policy-types', title: 'Policy Types', path: '/policy-types', icon: FolderLock },
  { id: 'payments', title: 'Payments', path: '/payments', icon: CreditCard },
];

export default navigationConfig;
