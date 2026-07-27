import { useId } from 'react';
import { clsx } from 'clsx';
import { Label, Caption } from './Typography';

/**
 * Reusable Input text box component.
 * @param {Object} props
 * @param {string} [props.label] - Optional text label.
 * @param {string} [props.error] - Validation error message.
 * @param {React.ReactNode} [props.iconLeft] - Prefix element.
 * @param {React.ReactNode} [props.iconRight] - Suffix element.
 * @param {string} [props.className] - Optional custom wrapper styling.
 * @param {string} [props.inputClassName] - Optional input-specific styling.
 */
export function Input({
  label,
  error,
  iconLeft,
  iconRight,
  disabled,
  className = '',
  inputClassName = '',
  ...props
}) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className={clsx('w-full flex flex-col', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      
      <div className="relative w-full">
        {/* Left Icon Placement */}
        {iconLeft && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-zinc-500">
            {iconLeft}
          </div>
        )}

        <input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={clsx(
            'w-full py-3 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-zinc-900',
            iconLeft ? 'pl-10.5' : 'pl-4',
            iconRight ? 'pr-10.5' : 'pr-4',
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
            inputClassName
          )}
          {...props}
        />

        {/* Right Icon Placement */}
        {iconRight && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 dark:text-zinc-500">
            {iconRight}
          </div>
        )}
      </div>

      {error && (
        <Caption id={`${id}-error`} variant="error">
          {error}
        </Caption>
      )}
    </div>
  );
}

export default Input;
