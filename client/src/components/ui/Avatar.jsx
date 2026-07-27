import { useState } from 'react';
import { clsx } from 'clsx';

/**
 * Returns initials from full name
 * @param {string} name
 */
function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Reusable Avatar component for profile pictures and textual fallback initials.
 * @param {Object} props
 * @param {string} [props.src] - Image path.
 * @param {string} [props.name] - User name for initials calculation.
 * @param {'sm'|'md'|'lg'|'xl'} [props.size]
 * @param {string} [props.className]
 */
export function Avatar({
  src,
  name = 'Anonymous',
  size = 'md',
  className = '',
  ...props
}) {
  const [imageError, setImageError] = useState(false);

  const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold select-none shrink-0 overflow-hidden bg-linear-to-br from-indigo-500 to-purple-600 border border-indigo-400/20 text-white';

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
  };

  const hasImage = src && !imageError;

  return (
    <div
      className={clsx(baseStyles, sizes[size], className)}
      {...props}
    >
      {hasImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

export default Avatar;
