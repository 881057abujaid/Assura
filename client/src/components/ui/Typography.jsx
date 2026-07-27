import { clsx } from 'clsx';

/**
 * Reusable Heading component.
 * @param {Object} props
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [props.as] - HTML heading tag.
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [props.variant] - Visual style variation.
 * @param {string} [props.className] - Optional custom styles.
 * @param {React.ReactNode} props.children
 */
export function Heading({ as: Component = 'h2', variant = 'h2', className = '', children, ...props }) {
  const styles = {
    h1: 'text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white',
    h2: 'text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white',
    h3: 'text-xl lg:text-2xl font-bold text-slate-900 dark:text-white',
    h4: 'text-lg font-semibold text-slate-900 dark:text-white',
    h5: 'text-base font-semibold text-slate-900 dark:text-white',
    h6: 'text-sm font-semibold text-slate-900 dark:text-white',
  };

  return (
    <Component className={clsx(styles[variant], className)} {...props}>
      {children}
    </Component>
  );
}

/**
 * Reusable Text component for standard body copy.
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {'normal'|'muted'|'dim'} [props.variant]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Text({ size = 'md', variant = 'normal', className = '', children, ...props }) {
  const sizeStyles = {
    sm: 'text-xs leading-normal',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed',
  };

  const variantStyles = {
    normal: 'text-slate-700 dark:text-zinc-300',
    muted: 'text-slate-500 dark:text-zinc-400',
    dim: 'text-slate-400 dark:text-zinc-500',
  };

  return (
    <p className={clsx(sizeStyles[size], variantStyles[variant], className)} {...props}>
      {children}
    </p>
  );
}

/**
 * Reusable input label form component.
 * @param {Object} props
 * @param {string} [props.htmlFor]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Label({ htmlFor, className = '', children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        'block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider select-none mb-1.5',
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

/**
 * Small helper text component.
 * @param {Object} props
 * @param {'info'|'error'|'success'|'warning'} [props.variant]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Caption({ variant = 'info', className = '', children, ...props }) {
  const colorStyles = {
    info: 'text-slate-400 dark:text-zinc-500',
    error: 'text-rose-500 dark:text-rose-400',
    success: 'text-emerald-500 dark:text-emerald-400',
    warning: 'text-amber-500 dark:text-amber-400',
  };

  return (
    <span className={clsx('text-[11px] font-medium leading-none block mt-1.5', colorStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}
