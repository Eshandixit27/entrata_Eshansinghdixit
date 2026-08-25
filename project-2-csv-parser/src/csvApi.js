export async function parseCsvRequest(csv) {
  let response;
  try {
    response = await fetch("/api/parse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ csv }) });
  } catch { throw new Error("The parser service is unavailable. Please try again."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Unable to parse CSV input.");
  return body;
}
