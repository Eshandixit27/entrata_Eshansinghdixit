const FAVORITES_KEY = "atmos:favorites";
const RECENTS_KEY = "atmos:recents";
const MAX_RECENTS = 5;

function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch { return []; }
}

function write(key, values) { localStorage.setItem(key, JSON.stringify(values)); }

export const cityStorage = {
  favorites: () => read(FAVORITES_KEY),
  recents: () => read(RECENTS_KEY),
  toggleFavorite(city) {
    const current = read(FAVORITES_KEY);
    write(FAVORITES_KEY, current.includes(city) ? current.filter((item) => item !== city) : [city, ...current]);
  },
  addRecent(city) {
    write(RECENTS_KEY, [city, ...read(RECENTS_KEY).filter((item) => item !== city)].slice(0, MAX_RECENTS));
  }
};
