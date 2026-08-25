# Project 2 - Resilient CSV Parser

This command-line utility parses CSV into structured records and errors. A malformed record never crashes the full parse or discards valid records from other rows.

## Run the web interface

```bash
npm start
```

Open `http://127.0.0.1:4174`. Paste CSV, load the provided sample, or choose a CSV file under 1 MB. The page shows valid records in a table and parser issues as row-specific messages.

## Run the CLI sample

```bash
npm run demo
```

## Parse your own file

```bash
npm run parse -- path/to/input.csv
```

## Test

```bash
npm test
npm run check
```

## Behavior

- Quoted commas, escaped quotes, and multiline quoted cells are supported.
- Missing and extra columns produce a row number and readable message.
- An unclosed quote produces `MALFORMED_QUOTE`, rather than throwing.
- Blank cells are accepted as values; blank rows are ignored.

The parser separates tokenization from record validation in `src/csv/csvParser.js`, returning `{ headers, records, errors }`.

## Architecture

```text
CSV input
  -> tokenizer (quote-aware rows and fields)
  -> record validation (headers and field counts)
  -> structured { headers, records, errors }
  -> CLI JSON output
```

`src/cli.js` is only responsible for file input and output. `src/csv/csvParser.js` contains parsing and validation behavior, keeping it independently testable.

## Error handling and decisions

- Missing and extra fields produce a row-specific error; valid rows remain in `records`.
- Quoted commas, escaped quotes, and quoted multiline fields are valid CSV content.
- An unclosed quote or unexpected content after a closing quote becomes `MALFORMED_QUOTE`, never an uncaught exception.
- Blank cells are deliberately valid; absent fields are not.
- Duplicate headers are rejected because they would make normalized record keys ambiguous.

## Security and trade-offs

The CLI reads the file path explicitly provided by the local user and does not execute or evaluate CSV content. It prints a safe, generic read error rather than an internal filesystem error. The parser reports an unclosed quote as an invalid remainder rather than attempting ambiguous recovery; a production ingestion system could add configurable recovery policies and streaming support for very large files.
