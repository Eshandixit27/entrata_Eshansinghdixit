import { createReadStream, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative } from "node:path";

const root = process.cwd();
function readLocalPort() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return undefined;
  const line = readFileSync(envPath, "utf8").split(/\r?\n/).find((item) => item.trim().startsWith("PORT="));
  return line?.split("=", 2)[1]?.trim();
}

const configuredPort = Number(process.env.PORT || readLocalPort() || 4173);
const port = Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort < 65536 ? configuredPort : 4173;
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".png": "image/png" };

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = normalize(join(root, requested));
  const pathFromRoot = relative(root, filePath);
  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); response.end("Not found"); return;
  }
  response.writeHead(200, { "Content-Type": `${types[extname(filePath)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Weather dashboard is running at http://127.0.0.1:${port}`));
