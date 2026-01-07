import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AuthApi } from '../api/auth';
import { focusFirstInvalid, isValidEmail } from '../auth/utils';

// PUBLIC_INTERFACE
export function SignUp() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const agreeRef = useRef(null);

  const errors = useMemo(() => {
    /** @type {Record<string, string>} */
    const e = {};

    if (!fullName.trim()) e.fullName = 'Please enter your full name.';
    if (!email.trim()) e.email = 'Please enter your email.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';

    if (!password) e.password = 'Please create a password.';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.';

    if (!confirm) e.confirm = 'Please confirm your password.';
    else if (confirm !== password) e.confirm = 'Passwords do not match.';

    if (!agree) e.agree = 'You must agree to the terms to continue.';
    return e;
  }, [fullName, email, password, confirm, agree]);

  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting;

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!canSubmit) {
      focusFirstInvalid(
        [
          { name: 'fullName', ref: nameRef },
          { name: 'email', ref: emailRef },
          { name: 'password', ref: passwordRef },
          { name: 'confirm', ref: confirmRef },
          { name: 'agree', ref: agreeRef },
        ],
        errors
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await AuthApi.signUp({ fullName, email, password });
      navigate('/signin?signup=success', { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Set up your profile to start applying."
      footer={
        <div className="ja-authFooterRow">
          <div className="ja-muted ja-small">
            <Link className="ja-link" to="/login">Back to login</Link>
            {' '}
            • Already have an account? <Link className="ja-link" to="/signin">Sign in</Link>
          </div>
        </div>
      }
    >
      {formError ? (
        <div className="ja-authNotice ja-authNotice--error" role="alert">
          {formError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} aria-label="Sign up form" noValidate>
        <Input
          label="Full name"
          value={fullName}
          onChange={(ev) => setFullName(ev.target.value)}
          placeholder="Jane Doe"
          autoComplete="name"
          error={errors.fullName}
          required
          ref={nameRef}
        />

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
          autoComplete="new-password"
          type="password"
          error={errors.password}
          required
          ref={passwordRef}
        />

        <Input
          label="Confirm password"
          value={confirm}
          onChange={(ev) => setConfirm(ev.target.value)}
          placeholder="Re-enter password"
          autoComplete="new-password"
          type="password"
          error={errors.confirm}
          required
          ref={confirmRef}
        />

        <div className="ja-authRow">
          <label className={`ja-check ja-authCheck ${errors.agree ? 'ja-authCheck--error' : ''}`}>
            <input
              ref={agreeRef}
              type="checkbox"
              checked={agree}
              onChange={(ev) => setAgree(ev.target.checked)}
              aria-invalid={Boolean(errors.agree)}
              aria-describedby={errors.agree ? 'ja_terms_error' : undefined}
            />
            <span>
              I agree to the <span className="ja-linkLike">terms</span> and <span className="ja-linkLike">privacy policy</span>
            </span>
          </label>

          {errors.agree ? (
            <div className="ja-error" id="ja_terms_error" role="alert">
              {errors.agree}
            </div>
          ) : null}
        </div>

        <Button variant="primary" size="lg" type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
          Create account
        </Button>

        <div className="ja-authHelp ja-muted ja-small">
          Tip: In mock mode, <code>@blocked.example</code> emails are rejected to demo server errors.
        </div>
      </form>
    </AuthCard>
  );
}
