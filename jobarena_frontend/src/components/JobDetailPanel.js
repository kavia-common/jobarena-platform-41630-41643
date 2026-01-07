import React from 'react';
import { Button } from './Button';

/**
 * @param {string} iso
 */
function formatPosted(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * @param {{
 *  job: import('../types/job').Job|null;
 *  onApply: () => void;
 *  onClose?: () => void;
 *  isCompact?: boolean;
 * }} props
 */
export function JobDetailPanel({ job, onApply, onClose, isCompact = false }) {
  if (!job) {
    return (
      <div className="ja-detail" aria-label="Job details">
        <div className="ja-detail__empty">
          <div className="ja-detail__title">Select a job</div>
          <div className="ja-muted">Choose a listing to view details and apply.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ja-detail" aria-label="Job details">
      <div className="ja-detail__header">
        <div>
          <div className="ja-detail__title">{job.title}</div>
          <div className="ja-detail__subtitle">
            {job.company} • {job.location}
          </div>
          <div className="ja-detail__meta">
            Posted {formatPosted(job.postedAtISO)} • {job.type} • {job.experience}
          </div>
        </div>

        <div className="ja-detail__headerActions">
          {onClose ? (
            <button className="ja-iconBtn" onClick={onClose} aria-label="Close details" type="button">
              ×
            </button>
          ) : null}
          <Button variant="primary" size={isCompact ? 'md' : 'lg'} onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>

      <div className="ja-detail__body">
        <div className="ja-detail__block">
          <div className="ja-sectionTitle">Compensation</div>
          <div>{job.salaryRange}</div>
        </div>

        <div className="ja-detail__block">
          <div className="ja-sectionTitle">About the role</div>
          <div className="ja-prose">
            {(job.description || '').split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>

        <div className="ja-detail__block">
          <div className="ja-sectionTitle">Skills</div>
          <div className="ja-tags">
            {(job.tags || []).map((t) => (
              <span className="ja-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
