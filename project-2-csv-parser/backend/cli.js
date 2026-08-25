import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseCsv } from "./csv/csvParser.js";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: npm run parse -- <path-to-csv>");
  process.exitCode = 1;
} else {
  try {
    const content = await readFile(resolve(inputPath), "utf8");
    console.log(JSON.stringify(parseCsv(content), null, 2));
  } catch (error) {
    console.error(`Unable to read CSV input: ${error.code === "ENOENT" ? "file not found." : "check the file and try again."}`);
    process.exitCode = 1;
  }
}
