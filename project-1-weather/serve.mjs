import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createApp } from "./backend/server.mjs";

const root = process.cwd();
function readLocalPort() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return undefined;
  const line = readFileSync(envPath, "utf8").split(/\r?\n/).find((item) => item.trim().startsWith("PORT="));
  return line?.split("=", 2)[1]?.trim();
}

const configuredPort = Number(process.env.PORT || readLocalPort() || 4173);
const port = Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort < 65536 ? configuredPort : 4173;
createApp().listen(port, "127.0.0.1", () => console.log(`Weather dashboard is running at http://127.0.0.1:${port}`));
