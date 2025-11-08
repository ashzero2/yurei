import { Telegraf } from "telegraf";
import { CONFIG } from "../../shared/config.js";

const bot = new Telegraf(CONFIG.telegramToken || "");

export default async function sendToTelegram(msg: string) {
    // TODO: implement core logic
    bot.telegram.sendMessage(CONFIG.telegramChatId, msg);
}


