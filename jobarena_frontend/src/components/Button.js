import React from 'react';

/**
 * @param {{
 *  variant?: 'primary'|'secondary'|'ghost'|'danger';
 *  size?: 'sm'|'md'|'lg';
 *  isLoading?: boolean;
 *  children: React.ReactNode;
 * } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...rest
}) {
  const cls = `ja-btn ja-btn--${variant} ja-btn--${size}`;

  return (
    <button className={cls} disabled={disabled || isLoading} {...rest}>
      {isLoading ? <span className="ja-spinner" aria-hidden="true" /> : null}
      <span className="ja-btn__label">{children}</span>
    </button>
  );
}
