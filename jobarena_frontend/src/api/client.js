import { filterMockJobs } from './mockData';

/**
 * Determine the backend base URL for API calls.
 * Prefers REACT_APP_API_BASE; falls back to REACT_APP_BACKEND_URL.
 * @returns {string}
 */
function getApiBaseUrl() {
  const apiBase = (process.env.REACT_APP_API_BASE || '').trim();
  const backendUrl = (process.env.REACT_APP_BACKEND_URL || '').trim();
  return apiBase || backendUrl;
}

/**
 * @typedef {Object} ApiResult
 * @property {boolean} isMock
 * @property {string} baseUrl
 */

/**
 * @returns {ApiResult}
 */
function getApiMode() {
  const baseUrl = getApiBaseUrl();
  return { isMock: !baseUrl, baseUrl };
}

/**
 * Perform a JSON fetch with sensible defaults.
 * @param {string} url
 * @param {RequestInit} [options]
 */
async function fetchJson(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers ? options.headers : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(
      `Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`
    );
    // @ts-ignore
    err.status = res.status;
    throw err;
  }

  // Try JSON; tolerate empty responses.
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  const raw = await res.text();
  return raw ? JSON.parse(raw) : null;
}

/**
 * API surface for jobs.
 * In mock mode, returns derived results from local mock data.
 */
export const JobsApi = {
  /**
   * Search jobs.
   * NOTE: When a backend is available, this can be wired to:
   * GET {baseUrl}/jobs?query=...&locations=... etc.
   *
   * @param {import('../types/job').JobSearchFilters} filters
   * @returns {Promise<{jobs: import('../types/job').Job[], mode: ApiResult}>}
   */
  async searchJobs(filters) {
    const mode = getApiMode();
    if (mode.isMock) {
      // Simulate latency for realistic UI state changes.
      await new Promise((r) => setTimeout(r, 250));
      return { jobs: filterMockJobs(filters), mode };
    }

    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    (filters.locations || []).forEach((l) => params.append('location', l));
    (filters.jobTypes || []).forEach((t) => params.append('type', t));
    (filters.experienceLevels || []).forEach((e) => params.append('experience', e));

    const data = await fetchJson(`${mode.baseUrl.replace(/\/$/, '')}/jobs?${params.toString()}`);
    // Expect data to be either {jobs:[...]} or [...]. Normalize.
    const jobs = Array.isArray(data) ? data : data?.jobs || [];
    return { jobs, mode };
  },

  /**
   * Fetch a single job by id.
   * NOTE: When a backend is available, this can be:
   * GET {baseUrl}/jobs/:id
   *
   * @param {string} id
   * @returns {Promise<{job: import('../types/job').Job|null, mode: ApiResult}>}
   */
  async getJob(id) {
    const mode = getApiMode();
    if (mode.isMock) {
      await new Promise((r) => setTimeout(r, 150));
      const jobs = filterMockJobs({
        query: '',
        locations: [],
        jobTypes: [],
        experienceLevels: [],
      });
      const job = jobs.find((j) => j.id === id) || null;
      return { job, mode };
    }

    const data = await fetchJson(`${mode.baseUrl.replace(/\/$/, '')}/jobs/${encodeURIComponent(id)}`);
    const job = data?.job || data || null;
    return { job, mode };
  },
};
