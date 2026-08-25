export const MAX_CITY_LENGTH = 100;

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateCity(value) {
  if (typeof value !== "string") throw new ValidationError("Enter a city name.");
  const city = value.trim().replace(/\s+/g, " ");
  if (!city) throw new ValidationError("Enter a city name.");
  if (city.length > MAX_CITY_LENGTH) throw new ValidationError("City names must be 100 characters or fewer.");
  if (!/^[\p{L}\p{M} .,'-]+$/u.test(city)) throw new ValidationError("Use letters and standard punctuation in the city name.");
  return city;
}

const weatherCodes = {
  0: ["Clear sky", "☀"], 1: ["Mainly clear", "☀"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁"],
  45: ["Fog", "〰"], 48: ["Rime fog", "〰"], 51: ["Light drizzle", "☂"], 53: ["Drizzle", "☂"],
  55: ["Heavy drizzle", "☂"], 61: ["Light rain", "☂"], 63: ["Rain", "☂"], 65: ["Heavy rain", "☂"],
  71: ["Light snow", "❄"], 73: ["Snow", "❄"], 75: ["Heavy snow", "❄"], 80: ["Rain showers", "☂"],
  81: ["Rain showers", "☂"], 82: ["Heavy showers", "☂"], 95: ["Thunderstorm", "ϟ"]
};

export function describeWeather(code) {
  return weatherCodes[code] ?? ["Unknown conditions", "◌"];
}

export function formatTemperature(value) {
  return `${Math.round(value)}°`;
}
