import { forwardRef, useId } from "react";
import clsx from "clsx";

import Label from "../Label";

const INPUT_BASE_STYLES =
  "w-full bg-bg-base border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:bg-surface disabled:text-text-secondary disabled:cursor-not-allowed";

const INPUT_DEFAULT_STYLES =
  "border-border-custom hover:border-slate-300 focus-visible:ring-primary";

const INPUT_ERROR_STYLES =
  "border-error focus-visible:ring-error";

const Input = forwardRef(
  (
    {
      label,
      error,
      id,
      className,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} disabled={disabled}>
            {label}
          </Label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={clsx(
            INPUT_BASE_STYLES,
            error ? INPUT_ERROR_STYLES : INPUT_DEFAULT_STYLES,
            className
          )}
          {...props}
        />

        {typeof error === "string" && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-0.5 text-xs font-medium leading-relaxed text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;