import { forwardRef } from "react";
import clsx from "clsx";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

const ALERT_BASE_STYLES =
  "flex items-start gap-3 rounded-xl border p-4 transition-all duration-150";

const ALERT_VARIANTS = {
  success: "border-success/30 bg-success/10",
  warning: "border-warning/30 bg-warning/10",
  error: "border-error/30 bg-error/10",
  info: "border-info/30 bg-info/10",
};

const ALERT_ICON_COLORS = {
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-info",
};

const ALERT_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const Alert = forwardRef(
  (
    {
      children,
      className,
      variant = "info",
      title,
      ...props
    },
    ref
  ) => {
    const Icon = ALERT_ICONS[variant] ?? ALERT_ICONS.info;

    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          ALERT_BASE_STYLES,
          ALERT_VARIANTS[variant] ?? ALERT_VARIANTS.info,
          className
        )}
        {...props}
      >
        <Icon
          aria-hidden="true"
          className={clsx(
            "mt-0.5 h-5 w-5 shrink-0",
            ALERT_ICON_COLORS[variant] ?? ALERT_ICON_COLORS.info
          )}
        />

        <div className="flex-1">
          {title && (
            <p className="mb-1 font-semibold text-text-primary">
              {title}
            </p>
          )}

          <div className="text-sm leading-relaxed text-text-primary">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;