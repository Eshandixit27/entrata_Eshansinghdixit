# Project 2 - ClearRows: Resilient CSV Parser

ClearRows is a fault-tolerant CSV parsing tool with both a browser workspace and a command-line interface. It separates valid records from malformed rows so a single broken line never prevents the rest of a file from being used. The web UI makes data quality easy to inspect with row-level issues, search, summary statistics, and clean-record export.

## Highlights

- Parse pasted CSV content or upload a local CSV file up to 1 MB.
- Keep valid records even when other rows contain missing fields, extra fields, or malformed quotes.
- Support quoted commas, escaped quotes, and multiline quoted fields.
- Report structured errors with row number, error type, and readable remediation detail.
- Filter valid records in the browser and export only clean rows as a new CSV file.
- Reuse the same parsing engine in the browser API and CLI workflow.

## Technology stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend | HTML5, CSS3, browser JavaScript modules | CSV workspace, file input, tables, filtering, export |
| Backend | Node.js built-in `http`, `fs`, and `path` modules | JSON parsing API and static frontend delivery |
| Parser | Custom quote-aware JavaScript tokenizer | Safe CSV tokenization and record validation without dependencies |
| CLI | Node.js `fs/promises` | Parse a user-provided local CSV file and print JSON |
| Testing | Node.js built-in test runner | Parser edge-case coverage |

The project intentionally has no third-party runtime dependencies.

## Project structure

```text
project-2-csv-parser/
├── frontend/
│   ├── index.html                 # Application structure and accessible controls
│   ├── public/images/             # Decorative interface artwork
│   └── src/
│       ├── app.js                 # Render state, upload, filtering, and export
│       ├── csvApi.js              # Client for POST /api/parse
│       └── styles.css             # Responsive workspace design
├── backend/
│   ├── server.mjs                 # HTTP routes, request-size limit, static files
│   ├── cli.js                     # File-to-JSON command-line adapter
│   └── csv/csvParser.js           # Tokenizer, validation, and result contract
├── samples/                       # Demonstration and edge-case CSV files
├── tests/csvParser.test.js        # Parser unit tests
├── serve.mjs                      # Application startup entry point
└── package.json
```

## Architecture

```text
Browser UI / CLI
  -> frontend/src/csvApi.js or backend/cli.js
  -> POST /api/parse or direct parser call
  -> backend/csv/csvParser.js
      -> quote-aware tokenization
      -> header validation
      -> field-count validation
  -> { headers, records, errors }
  -> valid-record table + row-level issue list / CLI JSON
```

The parser does not depend on UI code, HTTP code, or filesystem code. This keeps it deterministic, reusable, and straightforward to test.

## Parsing behavior

| Input condition | Result |
| --- | --- |
| Quoted comma | Preserved as part of one field |
| Escaped quote (`""`) | Decoded as a single quote character |
| Multiline quoted field | Preserved as one field across lines |
| Missing columns | Row excluded from `records`; `MISSING_COLUMNS` error returned |
| Extra columns | Row excluded from `records`; `EXTRA_COLUMNS` error returned |
| Unclosed or invalid quote | `MALFORMED_QUOTE` error returned without a crash |
| Empty CSV input | `EMPTY_INPUT` error returned |
| Duplicate header | `DUPLICATE_HEADER` error returned because keys would be ambiguous |
| Blank cell | Retained as a valid empty value |
| Blank row | Ignored |

## API contract

### `POST /api/parse`

Request body:

```json
{ "csv": "name,email\nEshan,eshan@example.com" }
```

Successful response:

```json
{
  "headers": ["name", "email"],
  "records": [{ "name": "Eshan", "email": "eshan@example.com" }],
  "errors": []
}
```

The server accepts JSON only and limits the request body to 1 MB. Invalid JSON, non-text CSV values, and oversized bodies return a safe HTTP 400 response with a `message` field.

## Run locally

Requirements: Node.js 18 or later.

### Web workspace

```bash
cd project-2-csv-parser
npm start
```

Open http://127.0.0.1:4174.

### CLI sample

```bash
npm run demo
```

### Parse your own file

```bash
npm run parse -- path/to/input.csv
```

The CLI prints the same structured result used by the API.

## Test and validate

```bash
npm test
npm run check
```

Tests cover valid records, quoted commas, missing columns, extra columns, unclosed quotes, and multiline quoted values. `npm run check` verifies syntax for the frontend client, backend server, parser, and CLI.

## Security and reliability

- The parser treats CSV as data only; it never evaluates cell content as code.
- Browser rendering uses DOM text nodes for CSV values and issue text, avoiding HTML injection.
- The backend limits API request bodies to 1 MB and reports safe validation messages.
- Static-file serving rejects path traversal attempts and unsupported HTTP methods.
- The CLI reads only the explicit user-provided file path and returns generic read errors rather than internal filesystem details.
- A malformed row cannot throw an uncaught parser error or discard independent valid rows.

## Trade-offs and future improvements

ClearRows processes complete input in memory, which is the right trade-off for the current 1 MB UI limit and keeps the code simple. A production ingestion pipeline could add streaming support for large files, configurable required-column rules, delimiter selection, schema/type validation, error-file downloads, authentication, audit trails, and background jobs for long-running imports.
