import { forwardRef } from "react";
import clsx from "clsx";

const BADGE_BASE_STYLES =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-150";

const BADGE_VARIANTS = {
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  error: "border-error/30 bg-error/10 text-error",
  info: "border-info/30 bg-info/10 text-info",
  neutral: "border-border-custom bg-surface text-text-secondary",
};

const Badge = forwardRef(
  (
    {
      children,
      className,
      variant = "neutral",
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={clsx(
          BADGE_BASE_STYLES,
          BADGE_VARIANTS[variant] ?? BADGE_VARIANTS.neutral,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;