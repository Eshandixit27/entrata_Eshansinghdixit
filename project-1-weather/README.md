# Project 1 - Atmos Weather Dashboard

Enter a city to view its current temperature, humidity, wind, apparent temperature, and weather condition. The interface includes loading, safe failure, retry, unit-selection, recent-search, and favorite-city states.

## Run

```bash
copy .env.example .env
npm start
```

Open `http://127.0.0.1:4173`.

`PORT` is optional and defaults to `4173`. There is no weather API key to configure.

## Test

```bash
npm test
npm run check
```

## Architecture

```text
Browser UI (src/app.js)
  -> city validation (src/domain/weather.js)
  -> Open-Meteo client and response validation (src/services/weatherClient.js)
  -> public weather APIs
```

`src/storage.js` owns localStorage access for favorites and recent searches. `serve.mjs` is a dependency-free local static server and reads only the optional `PORT` setting.

## Design decisions

- Open-Meteo was chosen because it is a public API with no browser-exposed secret.
- City input is normalized, length-limited, and character-validated before a request is sent.
- The service layer validates geocoding and forecast response shapes before converting them into the UI model.
- Browser-local favorites and recent cities avoid a database for data that is specific to the current browser.

## Error handling and security

- Empty, malformed, and excessive-length city names show safe field errors.
- Timeouts, network failures, non-success API status codes, invalid cities, and malformed API responses return user-safe messages and a retry action.
- No secrets are hardcoded or logged. `.env` is ignored by Git; it only supports an optional local port.
- City names are encoded for requests, and UI text is rendered with `textContent` to avoid injecting user input as HTML.

## Trade-offs and future work

The project intentionally avoids a backend because the selected provider needs no credential. A production credentialed API would put requests, caching, rate limiting, and observability behind a server-side endpoint. Further work could add location selection for duplicate city names and integration tests against a controlled HTTP server.
