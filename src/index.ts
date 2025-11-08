import { startAgent } from "./agent/agent.js";
import { startAlertEngine } from "./alert/engine.js";
import { startServer } from "./server/index.js";

const MODE = process.env.YUREI_MODE ?? "all";

process.on('uncaughtException', err => {
  console.error('[FATAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('[FATAL] Unhandled Rejection:', err);
});

console.log(`[YUREI] Starting in mode: ${MODE.toUpperCase()}`);

if (MODE === "agent") {
    startAgent();
} else if(MODE === "server") {
    startServer();
} else if(MODE === "alert") {
    startAlertEngine();
}

if (MODE === "all") {
  Promise.allSettled([
    (async () => startAgent())(),
    (async () => startServer())(),
    (async () => startAlertEngine())(),
  ]).then(() => console.log('[YUREI] All modules started.'));
}


