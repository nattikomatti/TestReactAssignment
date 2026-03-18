const TOKEN_KEY = "token";

/** Custom event name fired whenever the stored token is written or cleared (same-tab). */
export const AUTH_TOKEN_EVENT = "auth:tokenChanged";

export function dispatchTokenChange(): void {
  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
}

/**
 * Persist a JWT and notify all listeners in the same tab.
 * Cross-tab sync is handled by the native `storage` event.
 */
export function storeToken(token: string, rememberMe: boolean): void {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  dispatchTokenChange();
}

// ─── token storage ────────────────────────────────────────────
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  dispatchTokenChange();
}

// ─── JWT decode (single source of truth) ──────────────────────
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ─── token validity ───────────────────────────────────────────
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return (payload.exp as number) > Date.now() / 1000;
}

export function ensureValidToken(): string | null {
  const t = getStoredToken();
  if (!isTokenValid(t)) {
    clearStoredToken();
    return null;
  }
  return t;
}

// ─── claim helpers (reusable across components) ───────────────
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

export function getRoleFromToken(token?: string | null): string {
  const t = token ?? getStoredToken();
  if (!t) return "";
  const p = decodeJwt(t);
  const role = (p?.role ?? p?.[ROLE_CLAIM] ?? "") as string;
  return role.toLowerCase();
}

export function getNameFromToken(token?: string | null): string {
  const t = token ?? getStoredToken();
  if (!t) return "";
  const p = decodeJwt(t);
  if (!p) return "";
  const name =
    (p.fullName as string) ||
    (p.name as string) ||
    (p[NAME_CLAIM] as string) ||
    ((p.email as string)?.split("@")[0] ?? "");
  return name || "";
}

export function isAdmin(token?: string | null): boolean {
  return getRoleFromToken(token) === "admin";
}