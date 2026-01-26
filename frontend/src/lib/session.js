const USER_KEY = "user";

export const storeUserSession = (user) => {
  if (!user) return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn("Failed to persist user session", error);
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};
