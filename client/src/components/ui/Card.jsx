import { clsx } from 'clsx';

/**
 * Reusable Card container.
 * @param {Object} props
 * @param {'default'|'outline'|'glass'|'flat'} [props.variant]
 * @param {boolean} [props.clickable]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Card({
  variant = 'default',
  clickable = false,
  className = '',
  children,
  ...props
}) {
  const baseStyles = 'rounded-2xl transition-all duration-200 overflow-hidden';
  
  const variants = {
    default: 'bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm',
    outline: 'border border-slate-200 dark:border-zinc-800 bg-transparent',
    glass: 'glass-card shadow-glass',
    flat: 'bg-slate-100/70 dark:bg-zinc-900/40 border border-transparent',
  };

  const clickableStyles = clickable 
    ? 'cursor-pointer hover:shadow-md hover:scale-[1.005] active:scale-[0.995]' 
    : '';

  return (
    <div 
      className={clsx(baseStyles, variants[variant], clickableStyles, className)} 
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Reusable CardHeader section.
 */
export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={clsx('px-6 py-5 border-b border-slate-100 dark:border-zinc-900 flex flex-col gap-1.5', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Reusable CardTitle section.
 */
export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={clsx('text-base font-bold text-slate-900 dark:text-white m-0 leading-none', className)} {...props}>
      {children}
    </h3>
  );
}

/**
 * Reusable CardDescription section.
 */
export function CardDescription({ className = '', children, ...props }) {
  return (
    <p className={clsx('text-xs text-slate-500 dark:text-zinc-400 m-0', className)} {...props}>
      {children}
    </p>
  );
}

/**
 * Reusable CardContent section.
 */
export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={clsx('p-6', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Reusable CardFooter section.
 */
export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={clsx('px-6 py-4 bg-slate-50/50 dark:bg-zinc-900/10 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-end gap-3', className)} {...props}>
      {children}
    </div>
  );
}
