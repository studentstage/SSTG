const TOKEN_KEY = "access_token";
const USER_KEY = "user_data";

export function readSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
  }
  return { token, user };
}

export function writeSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
