export const CsvErrorType = Object.freeze({
  EMPTY_INPUT: "EMPTY_INPUT", MALFORMED_QUOTE: "MALFORMED_QUOTE", MISSING_COLUMNS: "MISSING_COLUMNS",
  EXTRA_COLUMNS: "EXTRA_COLUMNS", DUPLICATE_HEADER: "DUPLICATE_HEADER"
});

function error(row, type, message) { return { row, type, message }; }

export function tokenizeCsv(input) {
  const rows = [];
  const errors = [];
  let row = 1, field = "", fields = [], quoted = false, closedQuote = false;
  const pushRow = () => { if (fields.length || field) rows.push({ row, values: [...fields, field] }); fields = []; field = ""; closedQuote = false; };
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"') {
        if (input[index + 1] === '"') { field += '"'; index += 1; }
        else { quoted = false; closedQuote = true; }
      } else { field += character; if (character === "\n") row += 1; }
      continue;
    }
    if (closedQuote && character !== "," && character !== "\n" && character !== "\r") {
      errors.push(error(row, CsvErrorType.MALFORMED_QUOTE, "Unexpected content after a closing quote."));
      while (input[index] && input[index] !== "\n") index += 1;
      pushRow(); row += 1; continue;
    }
    if (character === '"' && !field) { quoted = true; continue; }
    if (character === ",") { fields.push(field); field = ""; closedQuote = false; continue; }
    if (character === "\n") { pushRow(); row += 1; continue; }
    if (character !== "\r") field += character;
  }
  if (quoted) errors.push(error(row, CsvErrorType.MALFORMED_QUOTE, "Unclosed quoted field."));
  else pushRow();
  return { rows, errors };
}

export function parseCsv(input) {
  if (typeof input !== "string" || !input.trim()) return { headers: [], records: [], errors: [error(1, CsvErrorType.EMPTY_INPUT, "CSV input cannot be empty.")] };
  const tokenized = tokenizeCsv(input);
  if (!tokenized.rows.length) return { headers: [], records: [], errors: tokenized.errors };
  const [headerRow, ...dataRows] = tokenized.rows;
  const headers = headerRow.values.map((header) => header.trim());
  const errors = [...tokenized.errors];
  const duplicate = headers.find((header, index) => header && headers.indexOf(header) !== index);
  if (duplicate) return { headers, records: [], errors: [...errors, error(headerRow.row, CsvErrorType.DUPLICATE_HEADER, `Duplicate header: ${duplicate}`)] };
  const records = [];
  for (const dataRow of dataRows) {
    if (dataRow.values.length < headers.length) { errors.push(error(dataRow.row, CsvErrorType.MISSING_COLUMNS, `Expected ${headers.length} fields but received ${dataRow.values.length}. Missing: ${headers.slice(dataRow.values.length).join(", ")}.`)); continue; }
    if (dataRow.values.length > headers.length) { errors.push(error(dataRow.row, CsvErrorType.EXTRA_COLUMNS, `Expected ${headers.length} fields but received ${dataRow.values.length}.`)); continue; }
    records.push(Object.fromEntries(headers.map((header, index) => [header, dataRow.values[index].trim()])));
  }
  return { headers, records, errors };
}
