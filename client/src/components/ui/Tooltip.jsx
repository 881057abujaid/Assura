import { useState } from 'react';
import { clsx } from 'clsx';

/**
 * Reusable Tooltip component.
 * Supports hover and keyboard focus state triggers for visual accessibility.
 * @param {Object} props
 * @param {React.ReactNode} props.content - Tooltip text or components.
 * @param {'top'|'bottom'|'left'|'right'} [props.position] - Placement relative to trigger.
 * @param {string} [props.className]
 * @param {React.ReactElement} props.children - Trigger node.
 */
export function Tooltip({
  content,
  position = 'top',
  className = '',
  children,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);

  const baseTooltipStyles = 'absolute z-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-50 dark:text-zinc-100 bg-slate-950/90 dark:bg-zinc-800/95 border border-slate-800 dark:border-zinc-700/80 rounded-lg shadow-md pointer-events-none transition-all duration-150 animate-fade-in whitespace-nowrap';

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={clsx('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={clsx(baseTooltipStyles, positions[position])}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
