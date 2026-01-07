import React, { useEffect, useId, useRef } from 'react';

/**
 * A lightweight accessible modal (dialog) without external dependencies.
 *
 * @param {{
 *  isOpen: boolean;
 *  title: string;
 *  onClose: () => void;
 *  children: React.ReactNode;
 *  footer?: React.ReactNode;
 *  size?: 'md'|'lg';
 * }} props
 */
export function Modal({ isOpen, title, onClose, children, footer, size = 'md' }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const lastActiveElRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElRef.current = document.activeElement;

    // Move focus into the dialog.
    const t = setTimeout(() => {
      if (dialogRef.current) dialogRef.current.focus();
    }, 0);

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      const last = lastActiveElRef.current;
      if (last && typeof last.focus === 'function') last.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ja-modalOverlay" role="presentation" onMouseDown={onClose}>
      <div
        className={`ja-modal ja-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="ja-modal__header">
          <h2 className="ja-modal__title" id={titleId}>
            {title}
          </h2>
          <button className="ja-iconBtn" onClick={onClose} aria-label="Close dialog" type="button">
            ×
          </button>
        </div>
        <div className="ja-modal__body">{children}</div>
        {footer ? <div className="ja-modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
