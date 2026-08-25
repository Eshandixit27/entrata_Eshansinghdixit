import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { validateCity, ValidationError } from "./domain/weather.js";
import { OpenMeteoWeatherClient, WeatherServiceError } from "./services/weatherClient.js";

const root = normalize(join(fileURLToPath(new URL("..", import.meta.url)), "frontend"));
const client = new OpenMeteoWeatherClient();
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png" };

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

async function handleWeather(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  try {
    const city = validateCity(url.searchParams.get("city") || "");
    const unit = url.searchParams.get("unit") === "fahrenheit" ? "fahrenheit" : "celsius";
    sendJson(response, 200, await client.getCurrentWeather(city, unit));
  } catch (error) {
    const status = error instanceof ValidationError ? 400 : error instanceof WeatherServiceError && error.type === "not-found" ? 404 : 503;
    sendJson(response, status, { message: error instanceof Error ? error.message : "Unable to fetch weather information right now. Please try again." });
  }
}

function serveStatic(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = normalize(join(root, requested));
  const pathFromRoot = relative(root, filePath);
  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); response.end("Not found"); return;
  }
  response.writeHead(200, { "Content-Type": `${types[extname(filePath)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
  createReadStream(filePath).pipe(response);
}

export function createApp() {
  return createServer((request, response) => {
    if (request.method === "GET" && new URL(request.url, `http://${request.headers.host}`).pathname === "/api/weather") { handleWeather(request, response); return; }
    if (request.method !== "GET" && request.method !== "HEAD") { sendJson(response, 405, { message: "Method not allowed." }); return; }
    serveStatic(request, response);
  });
}
