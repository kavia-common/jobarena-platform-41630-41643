import React, { useMemo, useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

/**
 * @param {string} email
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * @param {{
 *  isOpen: boolean;
 *  job: import('../types/job').Job|null;
 *  onClose: () => void;
 * }} props
 */
export function ApplyModal({ isOpen, job, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [cover, setCover] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState('idle'); // idle | success

  const errors = useMemo(() => {
    /** @type {{name?:string, email?:string, cover?:string}} */
    const e = {};
    if (!name.trim()) e.name = 'Please enter your full name.';
    if (!email.trim()) e.email = 'Please enter your email.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';
    if (cover.trim() && cover.trim().length < 40) {
      e.cover = 'If you include a cover note, please write at least 40 characters.';
    }
    return e;
  }, [name, email, cover]);

  const canSubmit = Object.keys(errors).length === 0 && Boolean(job) && !isSubmitting;

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    // Client-side only: simulate submission latency.
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setSubmitState('success');
  }

  function resetAndClose() {
    setSubmitState('idle');
    setName('');
    setEmail('');
    setPortfolio('');
    setCover('');
    onClose();
  }

  const title = job ? `Apply — ${job.title}` : 'Apply';

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={resetAndClose}
      size="lg"
      footer={
        submitState === 'success' ? (
          <div className="ja-modalFooterRow">
            <div className="ja-success">
              Application submitted (demo). We will email you if there is a next step.
            </div>
            <Button variant="primary" onClick={resetAndClose}>
              Done
            </Button>
          </div>
        ) : (
          <div className="ja-modalFooterRow">
            <div className="ja-muted">Client-side demo submission only.</div>
            <div className="ja-modalFooterActions">
              <Button variant="secondary" onClick={resetAndClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" onClick={onSubmit} isLoading={isSubmitting} type="submit" disabled={!canSubmit}>
                Submit application
              </Button>
            </div>
          </div>
        )
      }
    >
      {submitState === 'success' ? null : (
        <form onSubmit={onSubmit} className="ja-form" aria-label="Apply form">
          <div className="ja-formGrid">
            <Input
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
              error={errors.name}
              required
            />
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
              error={errors.email}
              required
            />
          </div>

          <Input
            label="Portfolio / LinkedIn (optional)"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="https://…"
            autoComplete="url"
          />

          <div className="ja-field">
            <label className="ja-label" htmlFor="ja_cover">
              Cover note (optional)
            </label>
            <textarea
              id="ja_cover"
              className={`ja-textarea ${errors.cover ? 'ja-input--error' : ''}`}
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="A brief note about why you're a good fit…"
              rows={6}
              aria-invalid={Boolean(errors.cover)}
            />
            {errors.cover ? (
              <div className="ja-error" role="alert">
                {errors.cover}
              </div>
            ) : (
              <div className="ja-help">Tip: Mention relevant projects and outcomes.</div>
            )}
          </div>

          <div className="ja-muted ja-small">
            By submitting, you agree your information will be shared with {job?.company || 'the employer'}.
          </div>
        </form>
      )}
    </Modal>
  );
}
