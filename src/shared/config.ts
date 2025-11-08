// Configuration settings for the yurei
import 'dotenv/config';

export const CONFIG = {
    redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    telegramToken: process.env.TELEGRAM_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
    thresholds: {
        cpu: Number(process.env.CPU_THRESHOLD ?? 85),
        mem: Number(process.env.MEM_THRESHOLD ?? 65),
        disk: Number(process.env.DISK_THRESHOLD ?? 85),
    },
    apiPort: Number(process.env.API_PORT ?? 8787),
}