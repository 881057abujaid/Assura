import { clsx } from 'clsx';

/**
 * Reusable Skeleton loader for content placeholders.
 * @param {Object} props
 * @param {'rectangle'|'circle'} [props.variant]
 * @param {string} [props.width]
 * @param {string} [props.height]
 * @param {string} [props.className]
 */
export function Skeleton({
  variant = 'rectangle',
  width,
  height,
  className = '',
  style,
  ...props
}) {
  const baseStyles = 'bg-slate-200 dark:bg-zinc-800 animate-pulse shrink-0';

  const variants = {
    rectangle: 'rounded-xl',
    circle: 'rounded-full',
  };

  const customStyle = {
    width: width || undefined,
    height: height || undefined,
    ...style,
  };

  return (
    <div
      className={clsx(baseStyles, variants[variant], className)}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Skeleton;
