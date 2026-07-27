import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Sparkles, Shield } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

/**
 * Visually stunning LoginPage placeholder representing Assura branding.
 * Utilizes custom hooks for logic and visual tokens for a high-end interface.
 */
export function LoginPage() {
  const { credentials, isLoading, error, handleChange, handleSubmit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-indigo-950 to-zinc-950 relative overflow-hidden px-4">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4 border border-indigo-400/30 animate-pulse">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0 flex items-center gap-2">
            ASSURA <span className="text-indigo-400 font-light text-sm tracking-widest px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10">CORE</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Enterprise Insurance Management Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* subtle line glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

          <h2 className="text-xl font-semibold text-white mb-2 text-left">
            Welcome back
          </h2>
          <p className="text-xs text-slate-400 mb-6 text-left">
            Authenticate to access your insurance operations dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Access Password
                </label>
                <a href="#forgot" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Display validation error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Sign In to System
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <span className="text-xs text-slate-500">
              Demo Credentials: <code className="text-slate-300 px-1.5 py-0.5 rounded bg-slate-900">admin@assura.com</code> / <code className="text-slate-300 px-1.5 py-0.5 rounded bg-slate-900">password</code>
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} Assura Core. Secure transmission protocol enabled.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
