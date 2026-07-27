import { useId } from 'react';
import { clsx } from 'clsx';
import { Label, Caption } from './Typography';

/**
 * Reusable Textarea component.
 * @param {Object} props
 * @param {string} [props.label] - Optional text label.
 * @param {string} [props.error] - Validation error message.
 * @param {string} [props.className] - Optional custom wrapper styles.
 * @param {string} [props.textareaClassName] - Optional textarea-specific styles.
 * @param {number} [props.rows] - Row count.
 */
export function Textarea({
  label,
  error,
  disabled,
  className = '',
  textareaClassName = '',
  rows = 4,
  ...props
}) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className={clsx('w-full flex flex-col', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={clsx(
          'w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-zinc-900 resize-y',
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
          textareaClassName
        )}
        {...props}
      />

      {error && (
        <Caption id={`${id}-error`} variant="error">
          {error}
        </Caption>
      )}
    </div>
  );
}

export default Textarea;
