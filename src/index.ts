import { startAgent } from "./agent/agent.js";
import { startAlertEngine } from "./alert/engine.js";
import { startServer } from "./server/index.js";
import { Logger } from "./utils/logger.js";

const MODE = process.env.YUREI_MODE ?? "all";
const logger = new Logger({ prefix: "YUREI" });

process.on('uncaughtException', err => {
  logger.error('[FATAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  logger.error('[FATAL] Unhandled Rejection:', err);
});

logger.info(`Starting in mode: ${MODE.toUpperCase()}`);

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
  ]).then(() => logger.info('[YUREI] All modules started.'));
}


