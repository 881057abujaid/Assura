import { forwardRef } from "react";
import clsx from "clsx";

const CARD_BASE_STYLES =
  "rounded-2xl border border-border-custom bg-bg-base p-6 transition-all duration-150 hover:border-primary/30";

const Card = forwardRef(
  (
    {
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          CARD_BASE_STYLES,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;