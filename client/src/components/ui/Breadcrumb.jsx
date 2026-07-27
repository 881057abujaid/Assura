import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Reusable Breadcrumb navigation trail.
 * @param {Object} props
 * @param {Array<{label: string, path?: string}>} props.items
 * @param {React.ReactNode} [props.separator] - Separator element.
 * @param {string} [props.className]
 */
export function Breadcrumb({
  items = [],
  separator = <ChevronRight className="h-3.5 w-3.5" />,
  className = '',
  ...props
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center text-xs font-medium text-slate-500 dark:text-zinc-400', className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {/* Separator before element (except first) */}
              {index > 0 && (
                <span className="text-slate-355 text-slate-400 dark:text-zinc-600 select-none" aria-hidden="true">
                  {separator}
                </span>
              )}

              {isLast || !item.path ? (
                <span 
                  className={clsx(
                    'font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[120px] md:max-w-xs',
                    isLast ? 'aria-current="page"' : ''
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors duration-150"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
