import React, { useId } from 'react';

/**
 * @param {{
 *  label: string;
 *  helpText?: string;
 *  error?: string;
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
export function Input({ label, helpText, error, id, ...rest }) {
  const autoId = useId();
  const inputId = id || autoId;
  const helpId = helpText ? `${inputId}__help` : undefined;
  const errorId = error ? `${inputId}__error` : undefined;

  return (
    <div className="ja-field">
      <label className="ja-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        className={`ja-input ${error ? 'ja-input--error' : ''}`}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      {helpText ? (
        <div className="ja-help" id={helpId}>
          {helpText}
        </div>
      ) : null}
      {error ? (
        <div className="ja-error" id={errorId} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}
