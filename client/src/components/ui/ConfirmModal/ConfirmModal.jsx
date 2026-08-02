import { forwardRef } from 'react'
import { AlertTriangle, AlertCircle, HelpCircle, X } from 'lucide-react'
import clsx from 'clsx'

import Card from '../Card'
import Button from '../Button'

const VARIANT_ICONS = {
  danger: AlertCircle,
  warning: AlertTriangle,
  primary: HelpCircle
}

const VARIANT_STYLES = {
  danger: {
    iconBg: 'bg-error/10 text-error border-error/20',
    buttonVariant: 'danger'
  },
  warning: {
    iconBg: 'bg-warning/10 text-warning border-warning/20',
    buttonVariant: 'primary'
  },
  primary: {
    iconBg: 'bg-primary/10 text-primary border-primary/20',
    buttonVariant: 'primary'
  }
}

export const ConfirmModal = forwardRef(
  (
    {
      isOpen,
      onClose,
      onConfirm,
      title = 'Are you sure?',
      message = 'Please confirm this action.',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'danger',
      loading = false,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null

    const Icon = VARIANT_ICONS[variant] || AlertCircle
    const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.danger

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
        <Card
          ref={ref}
          className="w-full max-w-md p-6 space-y-4 bg-bg-base border-border-custom shadow-2xl animate-in zoom-in-95 duration-150"
          {...props}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={clsx('p-3 rounded-2xl border shrink-0', styles.iconBg)}>
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary leading-tight">{title}</h3>
                <p className="text-xs text-text-secondary mt-0.5">Assura Action Required</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-text-secondary hover:text-text-primary p-1 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="text-sm text-text-secondary leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-border-custom">
            {message}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border-custom">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={styles.buttonVariant}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </Card>
      </div>
    )
  }
)

ConfirmModal.displayName = 'ConfirmModal'

export default ConfirmModal
