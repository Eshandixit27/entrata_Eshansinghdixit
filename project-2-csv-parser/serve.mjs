import { createApp } from "./backend/server.mjs";

const port = Number(process.env.PORT || 4174);
createApp().listen(port, "127.0.0.1", () => console.log(`CSV Parser is running at http://127.0.0.1:${port}`));
