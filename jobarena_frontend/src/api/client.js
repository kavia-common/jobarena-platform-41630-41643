import { filterMockJobs } from './mockData';
import { API_PATHS, JOBS_QUERY_PARAMS } from './constants';

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
 * Ensure a URL is joined safely: base + path (path should start with '/')
 * @param {string} baseUrl
 * @param {string} path
 * @returns {string}
 */
function joinUrl(baseUrl, path) {
  const b = baseUrl.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
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
 * Normalize job search response payloads.
 * Accepts either {jobs:[...]} or a bare array.
 * @param {any} data
 * @returns {import('../types/job').Job[]}
 */
function normalizeJobsResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.jobs)) return data.jobs;
  return [];
}

/**
 * API surface for jobs.
 * In mock mode, returns derived results from local mock data.
 */
export const JobsApi = {
  /**
   * Search jobs.
   *
   * Env wiring:
   * - Uses REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL.
   * - If neither is set, returns mock data (demo mode).
   *
   * Query params:
   * - q, location, type, experience
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

    // Required key: q (not "query")
    if (filters.query) params.set(JOBS_QUERY_PARAMS.q, filters.query);

    (filters.locations || []).forEach((l) => params.append(JOBS_QUERY_PARAMS.location, l));
    (filters.jobTypes || []).forEach((t) => params.append(JOBS_QUERY_PARAMS.type, t));
    (filters.experienceLevels || []).forEach((e) => params.append(JOBS_QUERY_PARAMS.experience, e));

    const url = `${joinUrl(mode.baseUrl, API_PATHS.jobs)}?${params.toString()}`;
    const data = await fetchJson(url);

    return { jobs: normalizeJobsResponse(data), mode };
  },

  /**
   * Fetch a single job by id.
   *
   * In mock mode, searches the mock dataset.
   * When a backend is available, this calls:
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

    const url = joinUrl(mode.baseUrl, `${API_PATHS.jobs}/${encodeURIComponent(id)}`);
    const data = await fetchJson(url);

    // Expect data to be either {job:{...}} or a bare object.
    const job = data?.job || data || null;
    return { job, mode };
  },
};
