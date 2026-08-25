export function validateCity(value) {
  const city = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!city) throw new Error("Enter a city name.");
  if (city.length > 100) throw new Error("City names must be 100 characters or fewer.");
  if (!/^[\p{L}\p{M} .,'-]+$/u.test(city)) throw new Error("Use letters and standard punctuation in the city name.");
  return city;
}

export function formatTemperature(value) { return `${Math.round(value)}\u00B0`; }
