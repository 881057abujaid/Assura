import { clsx } from 'clsx';

/**
 * Reusable Divider component.
 * @param {Object} props
 * @param {'horizontal'|'vertical'} [props.orientation]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children] - Optional label inside horizontal lines.
 */
export function Divider({
  orientation = 'horizontal',
  className = '',
  children,
  ...props
}) {
  const isHorizontal = orientation === 'horizontal';

  if (!isHorizontal) {
    return (
      <div
        className={clsx(
          'w-[1px] h-auto bg-slate-200 dark:bg-zinc-800 self-stretch mx-4 shrink-0',
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  return (
    <div
      className={clsx('w-full flex items-center my-6 shrink-0', className)}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    >
      {children ? (
        <>
          <div className="flex-1 h-[1px] bg-slate-200 dark:bg-zinc-800" />
          <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest select-none">
            {children}
          </span>
          <div className="flex-1 h-[1px] bg-slate-200 dark:bg-zinc-800" />
        </>
      ) : (
        <div className="w-full h-[1px] bg-slate-200 dark:bg-zinc-800" />
      )}
    </div>
  );
}

export default Divider;
