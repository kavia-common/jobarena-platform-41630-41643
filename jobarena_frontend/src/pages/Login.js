import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

/**
 * A lightweight login/landing page that routes users to Sign In / Sign Up.
 * Uses existing AuthCard-like styling classes for consistent theme.
 */

// PUBLIC_INTERFACE
export function Login() {
  /** Larger button style without adding new dependencies/components. */
  const bigBtnStyle = {
    width: '100%',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
  };

  return (
    <div className="ja-authPage" aria-label="Login landing page">
      <section className="ja-authCard" aria-labelledby="login_title">
        <div className="ja-authCard__header">
          <h1 className="ja-authCard__title" id="login_title">
            Jobarena
          </h1>
          <p className="ja-authCard__subtitle">
            Sign in to manage applications, or create an account to start applying.
          </p>
        </div>

        <div className="ja-authCard__body">
          <div className="ja-muted" style={{ marginBottom: 6 }}>
            Choose an option to continue:
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <Link to="/signin" style={{ textDecoration: 'none' }} aria-label="Go to sign in">
              <Button variant="primary" size="lg" type="button" aria-label="Sign in" style={bigBtnStyle}>
                Sign In
              </Button>
            </Link>

            <Link to="/signup" style={{ textDecoration: 'none' }} aria-label="Go to sign up">
              <Button variant="secondary" size="lg" type="button" aria-label="Sign up" style={bigBtnStyle}>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="ja-authCard__footer">
          <div className="ja-authFooterRow">
            <div className="ja-muted ja-small">
              Looking for jobs instead? <Link className="ja-link" to="/">Go to search</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
