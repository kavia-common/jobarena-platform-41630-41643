import React from 'react';

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
 *  jobs: import('../types/job').Job[];
 *  selectedJobId: string|null;
 *  onSelect: (job: import('../types/job').Job) => void;
 *  status: 'idle'|'loading'|'success'|'error';
 *  error: Error|null;
 * }} props
 */
export function JobList({ jobs, selectedJobId, onSelect, status, error }) {
  if (status === 'loading') {
    return (
      <div className="ja-panel" aria-busy="true">
        <div className="ja-panel__title">Loading jobs…</div>
        <div className="ja-skeletonList">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="ja-skeletonCard" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="ja-panel" role="alert">
        <div className="ja-panel__title">Could not load jobs</div>
        <div className="ja-muted">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </div>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="ja-panel">
        <div className="ja-panel__title">No results</div>
        <div className="ja-muted">
          Try adjusting your search or filters to find more opportunities.
        </div>
      </div>
    );
  }

  return (
    <div className="ja-panel" aria-label="Job results">
      <div className="ja-panel__title">
        Results <span className="ja-badge">{jobs.length}</span>
      </div>

      <ul className="ja-jobList">
        {jobs.map((job) => {
          const isSelected = selectedJobId === job.id;
          return (
            <li key={job.id}>
              <button
                className={`ja-jobCard ${isSelected ? 'ja-jobCard--selected' : ''}`}
                onClick={() => onSelect(job)}
                aria-label={`View details for ${job.title} at ${job.company}`}
              >
                <div className="ja-jobCard__top">
                  <div className="ja-jobCard__title">{job.title}</div>
                  <div className="ja-jobCard__meta">{formatPosted(job.postedAtISO)}</div>
                </div>

                <div className="ja-jobCard__company">{job.company}</div>

                <div className="ja-jobCard__row">
                  <span className="ja-pill">{job.location}</span>
                  <span className="ja-pill">{job.type}</span>
                  <span className="ja-pill">{job.experience}</span>
                </div>

                <div className="ja-jobCard__row ja-jobCard__row--tags">
                  {(job.tags || []).slice(0, 4).map((t) => (
                    <span className="ja-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="ja-jobCard__salary">{job.salaryRange}</div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
