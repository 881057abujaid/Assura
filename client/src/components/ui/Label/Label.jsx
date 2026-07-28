import { forwardRef } from "react";
import clsx from "clsx";

const LABEL_BASE_STYLES =
  "block select-none text-sm font-semibold text-text-primary";

const LABEL_DISABLED_STYLES =
  "text-text-secondary/70";

const Label = forwardRef(
  (
    {
      children,
      className,
      disabled = false,
      htmlFor,
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={clsx(
          LABEL_BASE_STYLES,
          disabled && LABEL_DISABLED_STYLES,
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

export default Label;