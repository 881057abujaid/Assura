import { forwardRef } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

const SPINNER_BASE_STYLES = "animate-spin";

const SPINNER_SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const Spinner = forwardRef(
  (
    {
      className,
      size = "md",
      ...props
    },
    ref
  ) => {
    return (
      <Loader2
        ref={ref}
        aria-hidden="true"
        className={clsx(
          SPINNER_BASE_STYLES,
          SPINNER_SIZES[size] ?? SPINNER_SIZES.md,
          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;