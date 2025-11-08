import { Telegraf } from "telegraf";
import { CONFIG } from "../../shared/config.js";
import type { AlertChannel } from "./channels.js";

export default class Telegram implements AlertChannel {
    bot = new Telegraf(CONFIG.telegramToken || "");

    async sendAlert(message: string): Promise<void> {
        await this.bot.telegram.sendMessage(CONFIG.telegramChatId, message);
    }

    getName(): string {
        return "Telegram";
    }
}

export function create(): AlertChannel {
    return new Telegram();
}