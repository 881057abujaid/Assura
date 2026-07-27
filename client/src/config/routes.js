/**
 * Centralized Route Metadata Configuration
 * Maps paths to page titles and access rules.
 */
export const routesConfig = [
  { path: '/', title: 'Dashboard Overview', requiresAuth: true },
  { path: '/dashboard', title: 'Dashboard Overview', requiresAuth: true },
  { path: '/login', title: 'Sign In', requiresAuth: false },
  { path: '/customers', title: 'Customers', requiresAuth: true },
  { path: '/policies', title: 'Policies', requiresAuth: true },
  { path: '/claims', title: 'Claims', requiresAuth: true },
  { path: '/policy-types', title: 'Policy Types', requiresAuth: true },
  { path: '/payments', title: 'Payments', requiresAuth: true },
];

export default routesConfig;
