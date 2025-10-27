import os from 'os';
import fetch from 'node-fetch';
import type { Metrics } from '../types.js';

const API_URL = 'http://localhost:8787/metrics';
const HOSTNAME = os.hostname();

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
      if (i === retries) console.error('Failed to send metrics:', err);
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

setInterval(collectData, 10_000);

process.on('SIGINT', () => {
  console.log('Yurei agent shutting down...');
  process.exit(0);
});

console.log(`Yurei agent started for host: ${HOSTNAME}`);
