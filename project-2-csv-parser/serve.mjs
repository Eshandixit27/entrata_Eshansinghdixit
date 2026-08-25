import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4174);
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
}).listen(port, "127.0.0.1", () => console.log(`CSV Parser is running at http://127.0.0.1:${port}`));
