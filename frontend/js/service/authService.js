const KEY = 'lc_auth';

function isAuthenticated() {
  return !!localStorage.getItem(KEY);
}

function setAuth(basicToken) {
  localStorage.setItem(KEY, basicToken);
}

function clearAuth() {
  localStorage.removeItem(KEY);
}

function getAuthHeader() {
  const t = localStorage.getItem(KEY);
  return t ? { Authorization: `Basic ${t}` } : {};
}

function getUsername() {
  const t = localStorage.getItem(KEY);
  if (!t) return null;
  try {
    const decoded = atob(t);
    const idx = decoded.indexOf(':');
    return idx > -1 ? decoded.slice(0, idx) : decoded;
  } catch { return null; }
}

export default { isAuthenticated, setAuth, clearAuth, getAuthHeader, getUsername };
