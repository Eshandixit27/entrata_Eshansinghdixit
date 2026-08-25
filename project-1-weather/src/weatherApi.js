export class WeatherApiError extends Error {}

export async function getCurrentWeather(city, unit) {
  let response;
  try { response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&unit=${unit}`); }
  catch { throw new WeatherApiError("Unable to fetch weather information right now. Please try again."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new WeatherApiError(body.message || "Unable to fetch weather information right now. Please try again.");
  return { ...body, updatedAt: new Date(body.updatedAt) };
}
