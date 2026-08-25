import { describeWeather } from "../domain/weather.js";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class WeatherServiceError extends Error {
  constructor(type, message) {
    super(message);
    this.name = "WeatherServiceError";
    this.type = type;
  }
}

function assertFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

async function requestJson(url, fetchImpl, signal) {
  let response;
  try {
    response = await fetchImpl(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw new WeatherServiceError("timeout", "The weather service took too long to respond.");
    throw new WeatherServiceError("network", "Weather service is temporarily unavailable. Please try again.");
  }
  if (!response.ok) throw new WeatherServiceError("api", "Weather service is temporarily unavailable. Please try again.");
  try { return await response.json(); }
  catch { throw new WeatherServiceError("malformed", "Weather service returned an unexpected response."); }
}

export class OpenMeteoWeatherClient {
  constructor({ fetchImpl = fetch, timeoutMs = 8000 } = {}) {
    this.fetchImpl = fetchImpl;
    this.timeoutMs = timeoutMs;
  }

  async getCurrentWeather(city, unit = "celsius") {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const geoUrl = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geo = await requestJson(geoUrl, this.fetchImpl, controller.signal);
      const place = geo?.results?.[0];
      if (!place || !assertFiniteNumber(place.latitude) || !assertFiniteNumber(place.longitude) || typeof place.name !== "string") {
        throw new WeatherServiceError("not-found", "We couldn't find weather information for that city. Please check the spelling and try again.");
      }
      const temperatureUnit = unit === "fahrenheit" ? "fahrenheit" : "celsius";
      const windSpeedUnit = unit === "fahrenheit" ? "mph" : "kmh";
      const forecastUrl = `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}`;
      const forecast = await requestJson(forecastUrl, this.fetchImpl, controller.signal);
      const current = forecast?.current;
      if (!current || !["temperature_2m", "relative_humidity_2m", "apparent_temperature", "weather_code", "wind_speed_10m"].every((key) => assertFiniteNumber(current[key]))) {
        throw new WeatherServiceError("malformed", "Weather service returned an unexpected response.");
      }
      const [condition, symbol] = describeWeather(current.weather_code);
      return {
        city: place.name, country: typeof place.country === "string" ? place.country : "",
        temperature: current.temperature_2m, humidity: current.relative_humidity_2m, apparentTemperature: current.apparent_temperature,
        windSpeed: current.wind_speed_10m, condition, symbol, unit: temperatureUnit, updatedAt: new Date()
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
