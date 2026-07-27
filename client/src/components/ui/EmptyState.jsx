import { clsx } from 'clsx';
import { Heading, Text } from './Typography';

/**
 * Reusable EmptyState component.
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - Visual icon.
 * @param {string} props.title - Action card heading.
 * @param {string} props.description - Explanatory context text.
 * @param {React.ReactNode} [props.action] - Optional button or trigger element.
 * @param {string} [props.className]
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
  ...props
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950/20 max-w-lg mx-auto',
        className
      )}
      {...props}
    >
      {/* Icon Frame */}
      {icon && (
        <div className="p-4 bg-slate-50 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 rounded-2xl mb-4 border border-slate-100 dark:border-zinc-800">
          {icon}
        </div>
      )}

      {/* Details */}
      <Heading variant="h4" className="mb-2 text-slate-800 dark:text-zinc-200">
        {title}
      </Heading>
      <Text variant="muted" size="sm" className="mb-6 max-w-sm">
        {description}
      </Text>

      {/* Custom Action Trigger */}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;
