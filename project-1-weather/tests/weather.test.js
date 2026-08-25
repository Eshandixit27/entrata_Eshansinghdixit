import test from "node:test";
import assert from "node:assert/strict";
import { validateCity, ValidationError } from "../backend/domain/weather.js";
import { OpenMeteoWeatherClient, WeatherServiceError } from "../backend/services/weatherClient.js";

test("normalizes a valid city", () => assert.equal(validateCity("  Pune  "), "Pune"));
test("rejects empty and unsafe city input", () => {
  assert.throws(() => validateCity(" "), ValidationError);
  assert.throws(() => validateCity("Pune<script>"), ValidationError);
});
test("maps a valid weather response", async () => {
  const responses = [
    { ok: true, json: async () => ({ results: [{ name: "Pune", country: "India", latitude: 18.5, longitude: 73.8 }] }) },
    { ok: true, json: async () => ({ current: { temperature_2m: 28, relative_humidity_2m: 72, apparent_temperature: 29, weather_code: 2, wind_speed_10m: 12 } }) }
  ];
  const client = new OpenMeteoWeatherClient({ fetchImpl: async () => responses.shift() });
  const weather = await client.getCurrentWeather("Pune");
  assert.equal(weather.city, "Pune"); assert.equal(weather.condition, "Partly cloudy");
});
test("returns a safe error when the service fails", async () => {
  const client = new OpenMeteoWeatherClient({ fetchImpl: async () => ({ ok: false, json: async () => ({}) }) });
  await assert.rejects(() => client.getCurrentWeather("Pune"), (error) => error instanceof WeatherServiceError && error.type === "api");
});
