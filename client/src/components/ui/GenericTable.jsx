import { clsx } from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';

/**
 * Reusable Generic Table component.
 * @param {Object} props
 * @param {Array<{key: string, header: string, sortable?: boolean, render?: (row: Object) => React.ReactNode}>} props.columns
 * @param {Array<Object>} props.data
 * @param {boolean} [props.loading]
 * @param {string} [props.sortKey]
 * @param {'asc'|'desc'} [props.sortOrder]
 * @param {Function} [props.onSort]
 * @param {React.ReactNode} [props.emptyState]
 * @param {boolean} [props.bordered]
 * @param {string} [props.className]
 */
export function GenericTable({
  columns = [],
  data = [],
  loading = false,
  sortKey = '',
  sortOrder = 'asc',
  onSort,
  emptyState,
  bordered = false,
  className = '',
  ...props
}) {
  const handleHeaderClick = (column) => {
    if (!column.sortable || !onSort) return;

    let newOrder = 'asc';
    if (sortKey === column.key && sortOrder === 'asc') {
      newOrder = 'desc';
    }
    onSort(column.key, newOrder);
  };

  const hasData = data && data.length > 0;

  return (
    <div className={clsx('w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs relative flex flex-col', className)} {...props}>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-10 animate-fade-in">
          <Spinner size="lg" />
        </div>
      )}

      {/* Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 select-none">
            <tr>
              {columns.map((column) => {
                const isSorted = sortKey === column.key;
                const isSortable = column.sortable && onSort;

                return (
                  <th
                    key={column.key}
                    onClick={() => handleHeaderClick(column)}
                    className={clsx(
                      'px-6 py-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider',
                      isSortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors' : '',
                      bordered ? 'border-r border-slate-200 dark:border-zinc-800 last:border-r-0' : ''
                    )}
                    role={isSortable ? 'columnheader' : undefined}
                    aria-sort={isSorted ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{column.header}</span>
                      {isSorted && (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                        )
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
            {hasData &&
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex}
                  className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={clsx(
                        'px-6 py-4.5 text-slate-700 dark:text-zinc-300 font-medium',
                        bordered ? 'border-r border-slate-100 dark:border-zinc-900 last:border-r-0' : ''
                      )}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!hasData && !loading && (
        <div className="py-12 px-6">
          {emptyState ? (
            emptyState
          ) : (
            <EmptyState
              title="No records found"
              description="No data records are available in this table at the moment."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default GenericTable;
