import { clsx } from 'clsx';
import { Modal } from './Modal';
import { Button } from './Button';
import { Text } from './Typography';

/**
 * Reusable ConfirmDialog component.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 * @param {string} props.title - Dialog card header.
 * @param {string} props.description - Message detail context.
 * @param {string} [props.confirmText]
 * @param {string} [props.cancelText]
 * @param {'danger'|'primary'|'success'} [props.variant]
 * @param {boolean} [props.loading]
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      className={clsx('w-full', className)}
      {...props}
    >
      <div className="space-y-6">
        <Text variant="muted" size="sm">
          {description}
        </Text>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
