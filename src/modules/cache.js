import Cookies from "js-cookie";

const EXPIRATION_HOURS = 12;

export const saveCache = (key, data) => {
  const cacheData = {
    timestamp: Date.now(),
    data,
  };
  Cookies.set(key, JSON.stringify(cacheData), { expires: EXPIRATION_HOURS / 24 }); // 12 часов
};

export const loadCache = (key) => {
  const cookie = Cookies.get(key);
  if (!cookie) return null;

  try {
    const { timestamp, data } = JSON.parse(cookie);
    const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (ageHours > EXPIRATION_HOURS) {
      Cookies.remove(key);
      return null;
    }
    return data;
  } catch {
    Cookies.remove(key);
    return null;
  }
};
