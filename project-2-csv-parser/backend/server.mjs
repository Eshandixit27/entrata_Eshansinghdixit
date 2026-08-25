import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "../src/csv/csvParser.js";

const root = normalize(join(fileURLToPath(new URL("..", import.meta.url))));
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png" };

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => { body += chunk; if (body.length > 1_000_000) reject(new Error("Input is too large.")); });
    request.on("end", () => { try { resolve(JSON.parse(body)); } catch { reject(new Error("Send a valid JSON request.")); } });
    request.on("error", reject);
  });
}

async function handleParse(request, response) {
  try {
    const body = await readJson(request);
    if (typeof body.csv !== "string") { sendJson(response, 400, { message: "CSV input must be text." }); return; }
    sendJson(response, 200, parseCsv(body.csv));
  } catch (error) { sendJson(response, 400, { message: error instanceof Error ? error.message : "Unable to parse CSV input." }); }
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
    if (request.method === "POST" && new URL(request.url, `http://${request.headers.host}`).pathname === "/api/parse") { handleParse(request, response); return; }
    if (request.method !== "GET" && request.method !== "HEAD") { sendJson(response, 405, { message: "Method not allowed." }); return; }
    serveStatic(request, response);
  });
}
