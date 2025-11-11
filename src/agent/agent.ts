import os from 'os';
import fetch from 'node-fetch';
import type { Metrics } from '../utils/types.js';
import { CONFIG } from '../shared/config.js';
import { Logger } from '../utils/logger.js';

const API_URL = `${CONFIG.SERVER_URL}:${CONFIG.SERVER_API_PORT}/metrics`;
const HOSTNAME = os.hostname();
const logger = new Logger({ prefix: "agent" });

async function collectData() {
  const cpuLoad = (os.loadavg()[0] / os.cpus().length) * 100;
  const memUsage = (1 - os.freemem() / os.totalmem()) * 100;
  const diskUsage = Math.random() * 80;

  const payload: Metrics = {
    host: HOSTNAME,
    cpu: +cpuLoad.toFixed(1),
    mem: +memUsage.toFixed(1),
    disk: +diskUsage.toFixed(1),
    timestamp: Date.now(),
  };

  logger.info(`Collected metrics: ${JSON.stringify(payload)}`);
  await sendWithRetry(payload);
}

async function sendWithRetry(payload: Metrics, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (i === retries) logger.error('Failed to send metrics:', err);
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

function startAgent() {
  setInterval(collectData, 5000);
  logger.info(`Yurei agent started for host: ${HOSTNAME}`);
}

export { startAgent };