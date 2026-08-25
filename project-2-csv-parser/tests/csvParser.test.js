import test from "node:test";
import assert from "node:assert/strict";
import { CsvErrorType, parseCsv } from "../backend/csv/csvParser.js";

test("parses valid records and quoted commas", () => {
  const result = parseCsv('name,location,age\nEshan,"Pune, Maharashtra",22');
  assert.deepEqual(result.records, [{ name: "Eshan", location: "Pune, Maharashtra", age: "22" }]);
  assert.deepEqual(result.errors, []);
});
test("keeps valid records when another record has missing columns", () => {
  const result = parseCsv("name,email,age\nEshan,eshan@example.com\nMira,mira@example.com,26");
  assert.equal(result.records.length, 1);
  assert.equal(result.errors[0].type, CsvErrorType.MISSING_COLUMNS);
  assert.match(result.errors[0].message, /Missing: age/);
});
test("reports extra columns", () => {
  const result = parseCsv("name,email,age\nEshan,eshan@example.com,22,India");
  assert.equal(result.errors[0].type, CsvErrorType.EXTRA_COLUMNS);
});
test("reports unclosed quotes without throwing", () => {
  const result = parseCsv('name,email\nEshan,"eshan@example.com');
  assert.equal(result.errors[0].type, CsvErrorType.MALFORMED_QUOTE);
});
test("accepts newlines inside quoted fields", () => {
  const result = parseCsv('name,note\nEshan,"first line\nsecond line"');
  assert.equal(result.records[0].note, "first line\nsecond line");
});
