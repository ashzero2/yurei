import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { CONFIG } from '../shared/config.js'
import { type Metrics } from '../utils/types.js'
import RedisPkg from "ioredis";
import { Logger } from '../utils/logger.js';

const app = new Hono()
const Redis = (RedisPkg as unknown as typeof import("ioredis").default)
const redis = new Redis(CONFIG.REDIS_URL);

const logger = new Logger({ prefix: "Hono Server" });


function startServer() {
  app.get('/', (c) => {
    return c.text('Hello Hono!')
  })

  redis.on('connect', () => logger.info('Connected to Redis'));
  redis.on('error', (err) => logger.error('Redis error:', err));

  app.post('/metrics', async (c) => {
    const body = await c.req.json<Metrics>();
    if(!body.host) return c.text('Host is required', 400);

    logger.info(`Received metrics: ${JSON.stringify(body)}`);
    await redis.set(`metrics:${body.host}`, JSON.stringify(body), 'EX', 60 * 5);
    await redis.publish('metrics', JSON.stringify(body));

    return c.json({ status: 'ok' });
  });

  process.on('SIGINT', async () => {
    logger.info('Shutting down Hono Server...');
    await redis.quit();
    process.exit(0);
  });

  app.onError((err, c) => {
    logger.error('Unhandled error:', err);
    return c.text('Internal Server Error', 500);
  });

  serve({
    fetch: app.fetch,
    port: CONFIG.SERVER_API_PORT || 3000,
  }, (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`)
  });
}

export { startServer };