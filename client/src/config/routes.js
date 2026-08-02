export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  COMPLETE_PROFILE: '/complete-profile',
  NOT_FOUND: '*',

  // Protected Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // Customer-facing routes
  MY_POLICIES: '/my-policies',
  MY_CLAIMS: '/my-claims',
  MY_DOCUMENTS: '/my-documents',

  // Admin/Agent routes
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:customerId',
  CUSTOMER_CREATE: '/customers/new',
  CUSTOMER_EDIT: '/customers/:customerId/edit',
  POLICIES: '/policies',
  POLICY_DETAIL: '/policies/:policyId',
  POLICY_CREATE: '/policies/new',
  POLICY_EDIT: '/policies/:policyId/edit',
  POLICY_TYPES: '/policy-types',
  POLICY_TYPE_CREATE: '/policy-types/new',
  POLICY_TYPE_EDIT: '/policy-types/:policyTypeId/edit',
  CLAIMS: '/claims',
  CLAIM_DETAIL: '/claims/:claimId',
  CLAIM_CREATE: '/claims/new',
  CLAIM_EDIT: '/claims/:claimId/edit',
  PAYMENTS: '/payments',
  PAYMENT_CREATE: '/payments/new',
  DOCUMENTS: '/documents',
}
