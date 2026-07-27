import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { Heading } from './Typography';

/**
 * Reusable Accessible Modal Overlay Dialog.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} [props.title] - Bold title.
 * @param {string} [props.size] - Overlay sizing width ('sm'|'md'|'lg').
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const modalRef = useRef(null);

  // Close on Escape key press & Trap focus
  useEffect(() => {
    if (!isOpen) return;

    // Save active element to return focus on close
    const previousActiveElement = document.activeElement;

    // Scroll Lock
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Basic keyboard focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Focus first focusable element inside modal
    if (modalRef.current) {
      const focusable = modalRef.current.querySelector(
        'input, select, textarea, button, a'
      );
      if (focusable) {
        focusable.focus();
      } else {
        modalRef.current.focus();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  };

  const portalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs animate-fade-in"
      />

      {/* Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={clsx(
          'relative w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in z-10 flex flex-col',
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-900 shrink-0">
          {title ? (
            <Heading id="modal-title" variant="h4" className="m-0 leading-tight">
              {title}
            </Heading>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="px-6 py-6 overflow-y-auto max-h-[70vh] text-left">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(portalContent, document.body);
}

export default Modal;
