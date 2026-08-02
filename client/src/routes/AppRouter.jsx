import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, ProfileCompletionPage } from '../features/auth'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import DashboardLayout from '../layouts/DashboardLayout'

import { DashboardPage } from '../features/dashboard'
import { ProfilePage } from '../features/users'
import { CustomerListPage, CustomerDetailPage, CustomerFormPage, CustomerPoliciesPage, CustomerClaimsPage, CustomerDocumentsPage } from '../features/customers'
import { PolicyListPage, PolicyDetailPage, PolicyFormPage, PolicyTypeListPage, PolicyTypeFormPage } from '../features/policy'
import { ClaimListPage, ClaimDetailPage, ClaimFormPage } from '../features/claims'
import { PaymentListPage, PaymentFormPage } from '../features/payments'
import { DocumentListPage } from '../features/documents'

import { ROUTES } from '../config/routes'
import NotFoundPage from '../pages/NotFoundPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer-facing routes */}
        <Route
          path={ROUTES.MY_POLICIES}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerPoliciesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MY_CLAIMS}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerClaimsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MY_DOCUMENTS}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerDocumentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin/Agent routes */}
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route
          path={ROUTES.COMPLETE_PROFILE}
          element={
            <ProtectedRoute allowIncompleteProfile={true}>
              <ProfileCompletionPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard/Management Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CUSTOMERS}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CUSTOMER_CREATE}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CUSTOMER_DETAIL}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CUSTOMER_EDIT}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.POLICIES}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PolicyListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.POLICY_CREATE}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PolicyFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.POLICY_DETAIL}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PolicyDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.POLICY_EDIT}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PolicyFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.POLICY_TYPES}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PolicyTypeListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.POLICY_TYPE_CREATE}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PolicyTypeFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.POLICY_TYPE_EDIT}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PolicyTypeFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CLAIMS}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClaimListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CLAIM_CREATE}
          element={
            <ProtectedRoute roles={['ADMIN', 'AGENT']}>
              <DashboardLayout>
                <ClaimFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CLAIM_DETAIL}
          element={
            <ProtectedRoute roles={['ADMIN', 'AGENT']}>
              <DashboardLayout>
                <ClaimDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CLAIM_EDIT}
          element={
            <ProtectedRoute roles={['ADMIN', 'AGENT']}>
              <DashboardLayout>
                <ClaimFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAYMENTS}
          element={
            <ProtectedRoute roles={['ADMIN', 'AGENT']}>
              <DashboardLayout>
                <PaymentListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAYMENT_CREATE}
          element={
            <ProtectedRoute roles={['ADMIN', 'AGENT']}>
              <DashboardLayout>
                <PaymentFormPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.DOCUMENTS}
          element={
            <ProtectedRoute roles={['ADMIN', 'AGENT']}>
              <DashboardLayout>
                <DocumentListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
