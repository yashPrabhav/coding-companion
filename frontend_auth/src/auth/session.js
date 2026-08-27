const TOKEN_KEY = "cc_auth_token";
const USER_KEY = "cc_auth_user";

export function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
    const user = localStorage.getItem(USER_KEY);

    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
    return Boolean(getToken());
}