/**
 * Central API constants to keep query param names and endpoints consistent across the app.
 */

/**
 * Query parameter names expected by the backend.
 * The request requires support for: q, location, type, experience.
 */
export const JOBS_QUERY_PARAMS = Object.freeze({
  q: 'q',
  location: 'location',
  type: 'type',
  experience: 'experience',
});

/**
 * API paths used by the frontend.
 */
export const API_PATHS = Object.freeze({
  jobs: '/jobs',
});
