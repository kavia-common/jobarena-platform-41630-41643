import React from 'react';

/**
 * @param {{
 *  title: string;
 *  subtitle?: string;
 *  children: React.ReactNode;
 *  footer?: React.ReactNode;
 * }} props
 */
export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="ja-authPage">
      <div className="ja-authCard" role="region" aria-label={title}>
        <div className="ja-authCard__header">
          <div className="ja-authCard__title">{title}</div>
          {subtitle ? <div className="ja-authCard__subtitle">{subtitle}</div> : null}
        </div>

        <div className="ja-authCard__body">{children}</div>

        {footer ? <div className="ja-authCard__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
