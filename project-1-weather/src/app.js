import { validateCity, formatTemperature } from "./domain/weather.js";
import { getCurrentWeather, WeatherApiError } from "./weatherApi.js";
import { cityStorage } from "./storage.js";

const elements = {
  form: document.querySelector("#weather-form"), input: document.querySelector("#city-input"), validation: document.querySelector("#validation-message"),
  status: document.querySelector("#weather-status"), result: document.querySelector("#weather-result"), city: document.querySelector("#weather-city"),
  temperature: document.querySelector("#weather-temperature"), tempUnit: document.querySelector("#temperature-unit"), condition: document.querySelector("#weather-condition"),
  symbol: document.querySelector("#weather-symbol"), humidity: document.querySelector("#weather-humidity"), wind: document.querySelector("#weather-wind"),
  apparent: document.querySelector("#weather-apparent"), updated: document.querySelector("#updated-at"), favorite: document.querySelector("#favorite-button"),
  favorites: document.querySelector("#favorites"), recents: document.querySelector("#recents"), tip: document.querySelector("#weather-tip")
};
let activeUnit = "celsius";
let lastCity = null;

function weatherTip(weather) {
  if (/thunder|heavy rain|heavy shower/i.test(weather.condition)) return ["\u26A1", "Plan for a wet day", "Keep an umbrella close and allow a little extra travel time."];
  if (weather.temperature >= 32) return ["\u2600", "Stay cool", "High heat today - carry water and seek shade during the afternoon."];
  if (weather.temperature <= 10) return ["\u25CC", "Layer up", "It feels chilly outside. A warm outer layer will make the day more comfortable."];
  if (weather.windSpeed >= 30) return ["\u219D", "A breezy one", "Secure loose items and consider an extra layer for the wind."];
  return ["\u2726", "Comfortable conditions", "A good window for a walk, errands, or time outdoors."];
}

function setStatus(message, kind = "") {
  elements.status.hidden = false;
  elements.status.className = `status ${kind}`;
  elements.status.innerHTML = `<p>${message}</p>`;
}

function renderSaved(container, cities, emptyText) {
  container.innerHTML = "";
  if (!cities.length) { container.innerHTML = `<p class="empty-list">${emptyText}</p>`; return; }
  cities.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button"; button.className = "city-chip"; button.textContent = city;
    button.addEventListener("click", () => search(city));
    container.append(button);
  });
}

function renderSavedLists() {
  renderSaved(elements.favorites, cityStorage.favorites(), "No saved cities.");
  renderSaved(elements.recents, cityStorage.recents(), "No searches yet.");
}

function renderWeather(weather) {
  lastCity = weather.city;
  elements.city.textContent = [weather.city, weather.country].filter(Boolean).join(", ");
  elements.temperature.textContent = formatTemperature(weather.temperature);
  elements.tempUnit.textContent = weather.unit === "fahrenheit" ? "F" : "C";
  elements.condition.textContent = weather.condition;
  elements.symbol.textContent = weather.symbol;
  elements.humidity.textContent = `${weather.humidity}%`;
  elements.wind.textContent = `${Math.round(weather.windSpeed)} ${weather.unit === "fahrenheit" ? "mph" : "km/h"}`;
  elements.apparent.textContent = `${formatTemperature(weather.apparentTemperature)}${weather.unit === "fahrenheit" ? "F" : "C"}`;
  const [icon, title, detail] = weatherTip(weather);
  elements.tip.innerHTML = `<span class="tip-icon" aria-hidden="true">${icon}</span><div><p>Today's tip</p><strong>${title}</strong><span>${detail}</span></div>`;
  elements.updated.textContent = `Updated ${weather.updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  const saved = cityStorage.favorites().includes(weather.city);
  elements.favorite.textContent = saved ? "★" : "☆";
  elements.favorite.setAttribute("aria-label", saved ? "Remove city from favorites" : "Add city to favorites");
  elements.favorite.title = elements.favorite.getAttribute("aria-label");
  elements.status.hidden = true;
  elements.result.hidden = false;
}

async function search(rawCity) {
  let city;
  try { city = validateCity(rawCity); }
  catch (error) { elements.validation.textContent = error.message; elements.result.hidden = true; return; }
  elements.validation.textContent = "";
  elements.result.hidden = true;
  setStatus("Fetching weather...", "loading");
  try {
    const weather = await getCurrentWeather(city, activeUnit);
    cityStorage.addRecent(weather.city);
    renderWeather(weather); renderSavedLists();
  } catch (error) {
    const message = error instanceof WeatherApiError ? error.message : "Unable to fetch weather information right now. Please try again.";
    setStatus(`${message} <button type="button" class="inline-retry">Retry</button>`, "error");
    elements.status.querySelector("button").addEventListener("click", () => search(city));
  }
}

elements.form.addEventListener("submit", (event) => { event.preventDefault(); search(elements.input.value); });
document.querySelectorAll("[data-unit]").forEach((button) => button.addEventListener("click", () => {
  activeUnit = button.dataset.unit;
  document.querySelectorAll("[data-unit]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  if (lastCity) search(lastCity);
}));
elements.favorite.addEventListener("click", () => { if (lastCity) { cityStorage.toggleFavorite(lastCity); renderSavedLists(); const saved = cityStorage.favorites().includes(lastCity); elements.favorite.textContent = saved ? "★" : "☆"; elements.favorite.setAttribute("aria-label", saved ? "Remove city from favorites" : "Add city to favorites"); } });
renderSavedLists();
