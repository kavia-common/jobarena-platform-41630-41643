import React, { useMemo } from 'react';
import { Button } from './Button';

/**
 * @param {string[]} values
 * @param {string} v
 */
function toggleValue(values, v) {
  if (values.includes(v)) return values.filter((x) => x !== v);
  return [...values, v];
}

/**
 * @param {{
 *  jobs: import('../types/job').Job[];
 *  filters: import('../types/job').JobSearchFilters;
 *  onChange: (next: import('../types/job').JobSearchFilters) => void;
 *  onReset: () => void;
 * }} props
 */
export function FiltersSidebar({ jobs, filters, onChange, onReset }) {
  const facets = useMemo(() => {
    const locations = Array.from(new Set(jobs.map((j) => j.location))).sort();
    const types = Array.from(new Set(jobs.map((j) => j.type))).sort();
    const exp = Array.from(new Set(jobs.map((j) => j.experience))).sort();

    return { locations, types, exp };
  }, [jobs]);

  return (
    <aside className="ja-sidebar" aria-label="Filters">
      <div className="ja-sidebar__header">
        <div>
          <div className="ja-sidebar__title">Filters</div>
          <div className="ja-sidebar__subtitle">Refine results</div>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="ja-sidebar__section" aria-label="Location filters">
        <div className="ja-sectionTitle">Location</div>
        {facets.locations.length ? (
          <ul className="ja-checklist">
            {facets.locations.map((loc) => (
              <li key={loc}>
                <label className="ja-check">
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(loc)}
                    onChange={() =>
                      onChange({ ...filters, locations: toggleValue(filters.locations, loc) })
                    }
                  />
                  <span>{loc}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ja-muted">No location facets.</div>
        )}
      </div>

      <div className="ja-sidebar__section" aria-label="Job type filters">
        <div className="ja-sectionTitle">Job type</div>
        {facets.types.length ? (
          <ul className="ja-checklist">
            {facets.types.map((t) => (
              <li key={t}>
                <label className="ja-check">
                  <input
                    type="checkbox"
                    checked={filters.jobTypes.includes(t)}
                    onChange={() =>
                      onChange({ ...filters, jobTypes: toggleValue(filters.jobTypes, t) })
                    }
                  />
                  <span>{t}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ja-muted">No job type facets.</div>
        )}
      </div>

      <div className="ja-sidebar__section" aria-label="Experience level filters">
        <div className="ja-sectionTitle">Experience</div>
        {facets.exp.length ? (
          <ul className="ja-checklist">
            {facets.exp.map((e) => (
              <li key={e}>
                <label className="ja-check">
                  <input
                    type="checkbox"
                    checked={filters.experienceLevels.includes(e)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        experienceLevels: toggleValue(filters.experienceLevels, e),
                      })
                    }
                  />
                  <span>{e}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ja-muted">No experience facets.</div>
        )}
      </div>
    </aside>
  );
}
