# Project 1 - Atmos Weather Dashboard

Atmos is a responsive weather dashboard that turns a city search into a clear, safe current-conditions view. It shows temperature, apparent temperature, humidity, wind, weather condition, a contextual daily tip, and the time of the latest result. The application is intentionally dependency-free and separates browser UI code from the server-side API boundary.

## Highlights

- Search for a city and view current weather conditions from Open-Meteo.
- Clear initial, loading, validation, success, not-found, and retryable error states.
- Switch between Celsius and Fahrenheit without changing the current city.
- Save favorite cities and revisit recent searches with browser-local storage.
- Receive a condition-aware tip, such as heat, rain, wind, cold, or comfortable-weather guidance.
- Use a keyboard-accessible, responsive interface on desktop and mobile.

## Technology stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend | HTML5, CSS3, browser JavaScript modules | Responsive interface, state rendering, and interaction handling |
| Backend | Node.js built-in `http`, `fs`, and `path` modules | Same-origin API endpoint and static frontend delivery |
| Weather provider | Open-Meteo Geocoding and Forecast APIs | City lookup and current weather data |
| Persistence | Browser `localStorage` | Favorites and five most recent searches |
| Testing | Node.js built-in test runner | Deterministic domain and weather-service tests |

No framework, database, package dependency, or API key is required.

## Project structure

```text
project-1-weather/
├── frontend/
│   ├── index.html                 # Accessible page structure
│   ├── public/images/             # Weather hero artwork
│   └── src/
│       ├── app.js                 # UI state, search, rendering, saved cities
│       ├── weatherApi.js          # Client for GET /api/weather
│       ├── weatherUtils.js        # Browser-side input preflight and formatting
│       ├── storage.js             # localStorage adapter
│       └── styles.css             # Responsive visual design
├── backend/
│   ├── server.mjs                 # HTTP routes and static-file server
│   ├── domain/weather.js          # Server-side validation and weather-code mapping
│   └── services/weatherClient.js  # Open-Meteo client and response validation
├── tests/weather.test.js          # Unit tests
├── serve.mjs                      # Application startup entry point
└── package.json
```

## Architecture

```text
Browser UI
  -> frontend/src/app.js
  -> frontend/src/weatherApi.js
  -> GET /api/weather?city=<city>&unit=<unit>
  -> backend/server.mjs
  -> backend/domain/weather.js (authoritative validation)
  -> backend/services/weatherClient.js
  -> Open-Meteo geocoding API
  -> Open-Meteo forecast API
  -> normalized weather JSON
  -> UI rendering and localStorage updates
```

The frontend performs immediate input feedback, while the backend validates again before calling the provider. This keeps the server boundary authoritative and prevents invalid requests from reaching the external service.

## API contract

### `GET /api/weather`

Query parameters:

| Parameter | Required | Accepted values |
| --- | --- | --- |
| `city` | Yes | A city name of 1-100 characters using letters and common city punctuation |
| `unit` | No | `celsius` (default) or `fahrenheit` |

Successful responses return normalized data rather than the raw provider payload:

```json
{
  "city": "Pune",
  "country": "India",
  "temperature": 28,
  "humidity": 72,
  "apparentTemperature": 29,
  "windSpeed": 12,
  "condition": "Partly cloudy",
  "symbol": "...",
  "unit": "celsius",
  "updatedAt": "2026-08-25T00:00:00.000Z"
}
```

Validation failures return HTTP 400, an unknown city returns HTTP 404, and safe provider/network failures return HTTP 503 with a user-friendly `message`.

## Run locally

Requirements: Node.js 18 or later.

```bash
cd project-1-weather
npm start
```

Open http://127.0.0.1:4173.

The optional `.env` file only supports a port override:

```bash
PORT=4173
```

There is no weather API key to configure. The selected provider does not require one for this use case.

## Test and validate

```bash
npm test
npm run check
```

The test suite covers city normalization, invalid input rejection, response mapping, and safe upstream-service failure behavior. `npm run check` performs syntax checks on the frontend API client, backend server, and weather client.

## Error handling and security

- City input is trimmed, whitespace-normalized, length-limited, and character-validated.
- Requests use encoded query values, an 8-second timeout, and response-shape validation.
- Provider errors, unavailable networks, malformed payloads, and unknown cities use safe public messages rather than stack traces or provider internals.
- The server permits only expected methods and blocks static-path traversal attempts.
- UI values are written with `textContent` where user or service data is displayed, avoiding HTML injection.
- `.env` and `.env.*` are ignored by Git; no credentials are hardcoded or logged.
- Favorites and recents remain in the current browser only; no user data is sent to an application database.

## Trade-offs and future improvements

The backend is deliberately small and serves the frontend itself, which makes the challenge easy to run locally. A production deployment could add response caching, request rate limits, observability, a health endpoint, and a location picker for cities with the same name. Forecast charts and automated API integration tests would also be useful next steps.
