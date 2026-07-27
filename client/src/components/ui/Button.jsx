import { clsx } from 'clsx';

/**
 * Reusable Button component supporting loading spinner overlay and icon mapping.
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.loading]
 * @param {React.ReactNode} [props.iconLeft]
 * @param {React.ReactNode} [props.iconRight]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  className = '',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs focus:ring-indigo-500 shadow-indigo-600/10 focus:ring-offset-white dark:focus:ring-offset-zinc-950',
    secondary: 'bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-900 dark:text-zinc-100 focus:ring-slate-500 focus:ring-offset-white dark:focus:ring-offset-zinc-950',
    outline: 'border border-slate-300 dark:border-zinc-700 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-zinc-950',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:ring-slate-500 focus:ring-offset-white dark:focus:ring-offset-zinc-950',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs focus:ring-rose-500 focus:ring-offset-white dark:focus:ring-offset-zinc-950',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-zinc-950',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5 rounded-2xl',
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" aria-hidden="true" />
      )}
      
      {/* Left Icon (only visible when not loading) */}
      {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
      
      <span>{children}</span>
      
      {/* Right Icon */}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

export default Button;
