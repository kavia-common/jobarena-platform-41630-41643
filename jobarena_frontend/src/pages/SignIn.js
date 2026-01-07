import React, { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AuthApi } from '../api/auth';
import { focusFirstInvalid, isValidEmail, storeToken } from '../auth/utils';

/**
 * @typedef {{ state?: any }} LocationLike
 */

/**
 * Parse query string to read optional success notice.
 * @param {string} search
 */
function getQuery(search) {
  try {
    return new URLSearchParams(search || '');
  } catch {
    return new URLSearchParams();
  }
}

// PUBLIC_INTERFACE
export function SignIn() {
  const navigate = useNavigate();
  const location = /** @type {LocationLike} */ (useLocation());

  const query = getQuery(location.search);
  const signupSuccess = query.get('signup') === 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState(signupSuccess ? 'Account created. Please sign in.' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const errors = useMemo(() => {
    /** @type {Record<string, string>} */
    const e = {};

    if (!email.trim()) e.email = 'Please enter your email.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';

    if (!password) e.password = 'Please enter your password.';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.';

    return e;
  }, [email, password]);

  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting;

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!canSubmit) {
      focusFirstInvalid(
        [
          { name: 'email', ref: emailRef },
          { name: 'password', ref: passwordRef },
        ],
        errors
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await AuthApi.signIn({ email, password, remember });
      storeToken(result.token);

      // Navigate to jobs after success.
      navigate('/jobs', { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back. Enter your details to continue."
      footer={
        <div className="ja-authFooterRow">
          <div className="ja-muted ja-small">
            <Link className="ja-link" to="/login">Back to login</Link>
            {' '}
            • New here? <Link className="ja-link" to="/signup">Create an account</Link>
          </div>
        </div>
      }
    >
      {successMsg ? (
        <div className="ja-authNotice ja-authNotice--success" role="status">
          {successMsg}
        </div>
      ) : null}

      {formError ? (
        <div className="ja-authNotice ja-authNotice--error" role="alert">
          {formError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} aria-label="Sign in form" noValidate>
        <Input
          label="Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          required
          ref={emailRef}
        />

        <Input
          label="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="At least 8 characters"
          autoComplete="current-password"
          type="password"
          error={errors.password}
          required
          ref={passwordRef}
        />

        <div className="ja-authRow">
          <label className="ja-check ja-authCheck">
            <input
              type="checkbox"
              checked={remember}
              onChange={(ev) => setRemember(ev.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <span className="ja-muted ja-small" aria-hidden="true">
            {/* Placeholder for future "Forgot password" link */}
          </span>
        </div>

        <Button variant="primary" size="lg" type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
          Sign in
        </Button>

        <div className="ja-authHelp ja-muted ja-small">
          Tip: In mock mode, any password works except <code>password123</code>.
        </div>
      </form>
    </AuthCard>
  );
}
