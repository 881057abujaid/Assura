import { clsx } from 'clsx';

/**
 * Reusable Spinner component.
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.color] - Class styling for the active spinner track.
 * @param {string} [props.className]
 */
export function Spinner({
  size = 'md',
  color = 'border-t-indigo-600 dark:border-t-indigo-400',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div 
      className={clsx('flex items-center justify-center', className)} 
      {...props}
    >
      <div
        className={clsx(
          'rounded-full animate-spin border-slate-200 dark:border-zinc-800 shrink-0',
          sizes[size],
          color
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default Spinner;
