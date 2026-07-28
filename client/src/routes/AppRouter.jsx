import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import LoginPage from '../features/auth/pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
