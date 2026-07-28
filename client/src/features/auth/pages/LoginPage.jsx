import React from 'react'
import { Shield, Mail, Lock } from 'lucide-react'

function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder login behavior
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphic Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl transition-all duration-300 hover:border-slate-700/80">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/30">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            Assura
          </h1>
          <p className="mt-2 text-sm text-slate-400 text-center">
            Enterprise Insurance Management Platform
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Secure, encrypted connection
        </div>
      </div>
    </div>
  )
}

export default LoginPage
