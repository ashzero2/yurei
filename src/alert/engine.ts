// Alert Engine for monitoring system metrics and triggering alerts
import RedisPkg from "ioredis";
import { CONFIG } from "../shared/config.js";
import { type Metrics } from "../utils/types.js";
import { Logger } from "../utils/logger.js";
import { getLoadedChannels, sendAlerts, type AlertChannel } from "./channels/channels.js";

const logger = new Logger({ prefix: "Alert Engine" });

function startAlertEngine() {
	const channels: Map<string, AlertChannel> = getLoadedChannels();

	const Redis = (RedisPkg as unknown as typeof import("ioredis").default)
	const redis = new Redis(CONFIG.REDIS_URL);
	logger.info("Yurei Alert Engine started.");

	redis.subscribe('metrics');

	redis.on('connect', () => logger.info("Connected to Redis"));
	redis.on('reconnecting', () => logger.info("Reconnecting to Redis"));
	redis.on('error', (err) => logger.error(err.message));

	process.on('SIGINT', async() => {
		logger.info("Shutting down Yurei alert Engine");
		await redis.quit();
		process.exit(0);
	})

	redis.on('message', async (_channel: string, message: string) => {
		try {
			const data: Metrics = JSON.parse(message);
			logger.info(`Received metrics: ${JSON.stringify(data)}`);
			await sendMetrics(data, channels);
		} catch (err) {
			logger.error("Error while parsing message from redis: ", err);
		}
	});
}

async function sendMetrics(data: Metrics, channels: Map<string, AlertChannel>) {
    const alerts: string[] = [];
    
    if (data.cpu > CONFIG.THRESHOLDS.CPU) {
        alerts.push(`CPU usage is high: ${data.cpu}%`);
    }
    if (data.mem > CONFIG.THRESHOLDS.MEM) {
        alerts.push(`Memory usage is high: ${data.mem}%`);
    }
    if (data.disk > CONFIG.THRESHOLDS.DISK) {
        alerts.push(`Disk usage is high: ${data.disk}%`);
    }

    if (alerts.length > 0) {
        const msg = `**${data.host} Alert**\n${alerts.join('\n')}\nTime: ${new Date(
            data.timestamp
        ).toLocaleString()}`;

        await sendAlerts(msg, channels);
    }
}

export { startAlertEngine };