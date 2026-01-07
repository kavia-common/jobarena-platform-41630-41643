/**
 * Shared auth utilities for validation and a11y.
 */

/**
 * @param {string} email
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}

/**
 * Focus the first invalid field given a priority list of refs.
 * @param {Array<{name: string, ref: React.RefObject<any>}>} refList
 * @param {Record<string, string>} errors
 */
export function focusFirstInvalid(refList, errors) {
  const first = refList.find((x) => Boolean(errors[x.name]));
  if (first?.ref?.current && typeof first.ref.current.focus === 'function') {
    first.ref.current.focus();
  }
}

/**
 * @returns {string|null}
 */
export function getStoredToken() {
  try {
    return localStorage.getItem('jobarena_token');
  } catch {
    return null;
  }
}

/**
 * @param {string} token
 */
export function storeToken(token) {
  try {
    localStorage.setItem('jobarena_token', token);
  } catch {
    // ignore (private browsing etc.)
  }
}

/**
 * Remove token from storage.
 */
export function clearToken() {
  try {
    localStorage.removeItem('jobarena_token');
  } catch {
    // ignore
  }
}
