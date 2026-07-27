import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Input } from './Input';

/**
 * Reusable SearchInput component featuring left search icon and right click-to-clear button.
 * @param {Object} props
 * @param {string} [props.value]
 * @param {Function} [props.onClear] - Callback when clicking X.
 * @param {string} [props.className]
 */
export function SearchInput({ value = '', onClear, className = '', ...props }) {
  return (
    <Input
      type="search"
      value={value}
      iconLeft={<Search className="h-4.5 w-4.5 text-slate-400 dark:text-zinc-500" />}
      iconRight={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-md text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null
      }
      className={clsx('w-full', className)}
      inputClassName="pr-10" // extra space for clear button
      {...props}
    />
  );
}

export default SearchInput;
