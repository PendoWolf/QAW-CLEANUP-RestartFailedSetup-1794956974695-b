import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics for the Tripwise Assistant. Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "c82b9c93-fccf-4bdc-9062-38eaa85206f6",
  agentId: "kg9ShrTmksflhFAqAXgPMTwrS8M",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Send Pendo's buffered events before the process stops.
server.on("close", () => {
  void pendo.shutdown();
});

async function stop(): Promise<void> {
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => {
  void stop();
});
process.on("SIGTERM", () => {
  void stop();
});
