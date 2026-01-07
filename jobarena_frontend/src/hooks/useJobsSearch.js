import { useEffect, useMemo, useRef, useState } from 'react';
import { JobsApi } from '../api/client';

const DEFAULT_FILTERS = {
  query: '',
  locations: [],
  jobTypes: [],
  experienceLevels: [],
};

/**
 * @param {Partial<import('../types/job').JobSearchFilters>} [initialFilters]
 */
export function useJobsSearch(initialFilters) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...(initialFilters || {}) });
  const [jobs, setJobs] = useState([]);
  const [mode, setMode] = useState({ isMock: true, baseUrl: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      (filters.query || '').trim() ||
        (filters.locations || []).length ||
        (filters.jobTypes || []).length ||
        (filters.experienceLevels || []).length
    );
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const rid = ++requestIdRef.current;

    async function run() {
      setStatus('loading');
      setError(null);
      try {
        const result = await JobsApi.searchJobs(filters);
        if (cancelled || requestIdRef.current !== rid) return;
        setJobs(result.jobs || []);
        setMode(result.mode);
        setStatus('success');
      } catch (e) {
        if (cancelled || requestIdRef.current !== rid) return;
        setError(e instanceof Error ? e : new Error('Unknown error'));
        setStatus('error');
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return {
    filters,
    setFilters,
    jobs,
    mode,
    status,
    error,
    hasActiveFilters,
  };
}
