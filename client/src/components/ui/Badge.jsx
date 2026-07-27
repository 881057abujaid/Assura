import { clsx } from 'clsx';

/**
 * Reusable Badge status chip.
 * @param {Object} props
 * @param {'neutral'|'primary'|'success'|'warning'|'danger'} [props.variant]
 * @param {'sm'|'md'} [props.size]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full border shrink-0 select-none';

  const variants = {
    neutral: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700/60',
    primary: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40',
    success: 'bg-emerald-550/10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
    warning: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    danger: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] tracking-wider uppercase',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}

export default Badge;
