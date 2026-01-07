/**
 * Auth API client.
 * Uses REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL to call:
 * - POST /auth/signin
 * - POST /auth/signup
 *
 * If neither env var is set, the client runs in mock mode with a small delay.
 */

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
    // Try to parse JSON error if present.
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const maybeJson = text ? JSON.parse(text) : null;
      if (maybeJson && typeof maybeJson.message === 'string') message = maybeJson.message;
    } catch {
      if (text) message = `${message} - ${text}`;
    }

    const err = new Error(message);
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
 * @param {number} ms
 */
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * @param {string} email
 */
function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

/**
 * @typedef {Object} SignInPayload
 * @property {string} email
 * @property {string} password
 * @property {boolean} [remember]
 */

/**
 * @typedef {Object} SignUpPayload
 * @property {string} fullName
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {{id: string, email: string, fullName?: string}} user
 * @property {ApiResult} mode
 */

/**
 * API surface for auth.
 */
export const AuthApi = {
  /**
   * Sign in.
   * - When configured, calls POST {baseUrl}/auth/signin
   * - Otherwise, returns a mock token.
   *
   * @param {SignInPayload} payload
   * @returns {Promise<AuthResponse>}
   */
  async signIn(payload) {
    const mode = getApiMode();
    const email = normalizeEmail(payload.email);
    const password = payload.password || '';

    if (mode.isMock) {
      // Simulate latency for realistic UI state changes.
      await delay(450);

      // Small bit of mock behavior to enable "server error" UI.
      if (password === 'password123') {
        throw new Error('Invalid email or password.');
      }

      return {
        token: `mock_${btoa(`${email}:${Date.now()}`)}`,
        user: { id: `user_${Math.random().toString(16).slice(2)}`, email },
        mode,
      };
    }

    const url = joinUrl(mode.baseUrl, '/auth/signin');
    const data = await fetchJson(url, {
      method: 'POST',
      body: JSON.stringify({ email, password, remember: Boolean(payload.remember) }),
    });

    // Accept {token, user} shape; fallback to common alternatives.
    const token = data?.token || data?.access_token || data?.accessToken;
    const user = data?.user || data?.profile || null;

    if (!token) throw new Error('Sign-in succeeded but no token was returned.');
    return {
      token,
      user: user || { id: 'unknown', email },
      mode,
    };
  },

  /**
   * Sign up.
   * - When configured, calls POST {baseUrl}/auth/signup
   * - Otherwise, returns a mock success response (no token), mirroring common flows.
   *
   * @param {SignUpPayload} payload
   * @returns {Promise<{user: {id: string, email: string, fullName?: string}, mode: ApiResult}>}
   */
  async signUp(payload) {
    const mode = getApiMode();
    const email = normalizeEmail(payload.email);
    const fullName = (payload.fullName || '').trim();
    const password = payload.password || '';

    if (mode.isMock) {
      await delay(550);

      // Mock: reject a specific email to demonstrate server errors.
      if (email.endsWith('@blocked.example')) {
        throw new Error('This email domain is not allowed.');
      }

      return {
        user: {
          id: `user_${Math.random().toString(16).slice(2)}`,
          email,
          fullName,
        },
        mode,
      };
    }

    const url = joinUrl(mode.baseUrl, '/auth/signup');
    const data = await fetchJson(url, {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });

    const user = data?.user || data?.profile || { id: 'unknown', email, fullName };
    return { user, mode };
  },
};
