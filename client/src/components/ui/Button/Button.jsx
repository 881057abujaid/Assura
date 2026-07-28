import { forwardRef } from "react";
import clsx from "clsx";

import Spinner from "../Spinner";

const BUTTON_BASE_STYLES =
  "inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

const BUTTON_VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary/95 focus-visible:ring-primary",

  secondary:
    "bg-bg-base border border-border-custom text-text-primary hover:bg-surface hover:border-slate-300 focus-visible:ring-primary",

  danger:
    "bg-error text-white hover:bg-error/95 focus-visible:ring-error",
};

const BUTTON_SIZES = {
  sm: "text-xs rounded-lg px-3 py-1.5 gap-1.5",
  md: "text-sm rounded-xl px-4 py-2.5 gap-2",
  lg: "text-base rounded-xl px-5 py-3 gap-2.5",
};

const Button = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading}
        className={clsx(
          BUTTON_BASE_STYLES,
          BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.primary,
          BUTTON_SIZES[size] ?? BUTTON_SIZES.md,
          className
        )}
        {...props}
      >
        {loading && (
          <>
            <Spinner size="sm" className="text-current" />
            <span className="sr-only">Loading...</span>
          </>
        )}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;