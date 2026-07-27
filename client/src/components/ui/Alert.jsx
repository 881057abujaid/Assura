import { clsx } from 'clsx';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XOctagon, 
  X 
} from 'lucide-react';
import { Heading, Text } from './Typography';

/**
 * Reusable Alert banner component.
 * @param {Object} props
 * @param {'info'|'success'|'warning'|'error'} [props.variant]
 * @param {string} [props.title] - Optional bold title header.
 * @param {React.ReactNode} props.children - Description details.
 * @param {Function} [props.onClose] - Close handler.
 * @param {string} [props.className]
 */
export function Alert({
  variant = 'info',
  title,
  onClose,
  className = '',
  children,
  ...props
}) {
  const containerStyles = 'flex gap-3.5 p-4 rounded-xl border relative w-full text-left';

  const variants = {
    info: 'bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/30 text-indigo-800 dark:text-indigo-400',
    success: 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400',
    warning: 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400',
    error: 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400',
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XOctagon,
  };

  const IconComponent = icons[variant];

  return (
    <div
      role="alert"
      className={clsx(containerStyles, variants[variant], className)}
      {...props}
    >
      {/* Type Icon */}
      <div className="shrink-0 mt-0.5">
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Message Area */}
      <div className="flex-1 space-y-1">
        {title && (
          <Heading variant="h6" className="text-current font-bold m-0 leading-tight">
            {title}
          </Heading>
        )}
        <Text size="sm" className="text-current opacity-90 m-0 leading-normal">
          {children}
        </Text>
      </div>

      {/* Dismiss Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-current/10 text-current transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
