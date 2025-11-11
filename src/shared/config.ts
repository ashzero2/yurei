// Configuration settings for the yurei
import 'dotenv/config';

export const CONFIG = {
    REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_TOKEN || '',
    TELEGRAM_USER_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
    THRESHOLDS: {
        CPU: Number(process.env.CPU_THRESHOLD ?? 85),
        MEM: Number(process.env.MEM_THRESHOLD ?? 85),
        DISK: Number(process.env.DISK_THRESHOLD ?? 85),
    },
    SERVER_URL: process.env.SERVER_URL || 'http://localhost',
    SERVER_API_PORT: Number(process.env.API_PORT ?? 8787),
}