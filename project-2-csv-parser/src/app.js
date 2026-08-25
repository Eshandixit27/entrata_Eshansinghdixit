import { parseCsv } from "./csv/csvParser.js";

const sample = `name,email,age
Eshan,eshan@example.com,22
Mira,mira@example.com
Ravi,"Pune, Maharashtra",31`;
const input = document.querySelector("#csv-input");
const fileInput = document.querySelector("#csv-file");
const fileMessage = document.querySelector("#file-message");
const summary = document.querySelector("#summary");
const recordsOutput = document.querySelector("#records-output");
const errorsOutput = document.querySelector("#errors-output");
const stats = document.querySelector("#stats");
const recordSearch = document.querySelector("#record-search");
const downloadButton = document.querySelector("#download-csv");
let latestResult = { headers: [], records: [], errors: [] };

function renderRecords(headers, records, query = "") {
  recordsOutput.replaceChildren();
  const normalizedQuery = query.trim().toLowerCase();
  const visibleRecords = normalizedQuery ? records.filter((record) => Object.values(record).some((value) => value.toLowerCase().includes(normalizedQuery))) : records;
  if (!visibleRecords.length) { recordsOutput.innerHTML = `<p class="empty-state">${records.length ? "No records match this filter." : "No valid records were found."}</p>`; return; }
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => { const cell = document.createElement("th"); cell.scope = "col"; cell.textContent = header || "(blank header)"; headerRow.append(cell); });
  const head = document.createElement("thead"); head.append(headerRow); table.append(head);
  const body = document.createElement("tbody");
  visibleRecords.forEach((record) => { const row = document.createElement("tr"); headers.forEach((header) => { const cell = document.createElement("td"); cell.textContent = record[header]; row.append(cell); }); body.append(row); });
  table.append(body); recordsOutput.append(table);
}

function renderErrors(errors) {
  errorsOutput.replaceChildren();
  if (!errors.length) { errorsOutput.innerHTML = '<p class="success-state">No issues found.</p>'; return; }
  const list = document.createElement("ul"); list.className = "error-list";
  errors.forEach((item) => { const entry = document.createElement("li"); const title = document.createElement("strong"); title.textContent = `Row ${item.row} - ${item.type}`; const detail = document.createElement("span"); detail.textContent = item.message; entry.append(title, detail); list.append(entry); });
  errorsOutput.append(list);
}

function render() {
  const result = parseCsv(input.value);
  latestResult = result;
  summary.textContent = `${result.records.length} valid record${result.records.length === 1 ? "" : "s"} and ${result.errors.length} issue${result.errors.length === 1 ? "" : "s"}.`;
  stats.replaceChildren(...[
    ["Rows read", result.records.length + result.errors.filter((item) => item.row > 1).length],
    ["Valid", result.records.length],
    ["Issues", result.errors.length]
  ].map(([label, value]) => { const item = document.createElement("div"); item.innerHTML = `<strong>${value}</strong><span>${label}</span>`; return item; }));
  downloadButton.disabled = !result.records.length;
  renderRecords(result.headers, result.records, recordSearch.value);
  renderErrors(result.errors);
}

function csvEscape(value) { const text = String(value ?? ""); return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function downloadValidRecords() {
  if (!latestResult.records.length) return;
  const lines = [latestResult.headers, ...latestResult.records.map((record) => latestResult.headers.map((header) => record[header]))].map((row) => row.map(csvEscape).join(","));
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "clearrows-valid-records.csv"; link.click(); URL.revokeObjectURL(url);
}

document.querySelector("#parse-csv").addEventListener("click", render);
document.querySelector("#load-sample").addEventListener("click", () => { input.value = sample; fileMessage.textContent = "Sample loaded."; render(); });
recordSearch.addEventListener("input", () => renderRecords(latestResult.headers, latestResult.records, recordSearch.value));
downloadButton.addEventListener("click", downloadValidRecords);
fileInput.addEventListener("change", async () => {
  const [file] = fileInput.files;
  if (!file) return;
  if (file.size > 1_000_000) { fileMessage.textContent = "Choose a CSV file smaller than 1 MB."; return; }
  try { input.value = await file.text(); fileMessage.textContent = `${file.name} loaded.`; render(); }
  catch { fileMessage.textContent = "Unable to read that file. Please choose another CSV file."; }
});
render();
