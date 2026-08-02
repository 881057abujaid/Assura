import { createContext, useContext, useState, useCallback } from 'react'
import { storage } from '../lib/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => storage.getUser())

  const setUser = useCallback((userData) => {
    storage.setUser(userData)
    setUserState(userData)
  }, [])

  const updateUser = useCallback((updater) => {
    setUserState((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      storage.setUser(updated)
      return updated
    })
  }, [])

  const clearUser = useCallback(() => {
    storage.clearUser()
    setUserState(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
