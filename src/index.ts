import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { CONFIG } from './config.js'
import { type Metrics } from './types.js'
import RedisPkg from "ioredis";
import { Logger } from './utils/logger.js';

const app = new Hono()
const Redis = (RedisPkg as unknown as typeof import("ioredis").default)
const redis = new Redis(CONFIG.redisUrl);

const logger = new Logger({ prefix: "Hono Server" });

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

redis.on('connect', () => logger.info('Connected to Redis'));
redis.on('error', (err) => logger.error('Redis error:', err));

app.post('/metrics', async (c) => {
  const body = await c.req.json<Metrics>();
  if(!body.host) return c.text('Host is required', 400);

  console.log(`Received metrics: ${JSON.stringify(body)}`);
  await redis.set(`metrics:${body.host}`, JSON.stringify(body), 'EX', 60 * 5);
  await redis.publish('metrics', JSON.stringify(body));

  return c.json({ status: 'ok' });
});

serve({
  fetch: app.fetch,
  port: CONFIG.apiPort || 3000,
}, (info) => {
  logger.info(`Server is running on http://localhost:${info.port}`)
})
