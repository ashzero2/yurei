import { Telegraf } from "telegraf";
import { CONFIG } from "../../shared/config.js";
import type { AlertChannel } from "./channels.js";

export default class Telegram implements AlertChannel {
    bot = new Telegraf(CONFIG.TELEGRAM_BOT_TOKEN || "");

    async sendAlert(message: string): Promise<void> {
        await this.bot.telegram.sendMessage(CONFIG.TELEGRAM_USER_CHAT_ID, message);
    }

    getName(): string {
        return "Telegram";
    }
}

export function create(): AlertChannel {
    return new Telegram();
}