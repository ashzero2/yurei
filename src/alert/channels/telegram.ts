import { Telegraf } from "telegraf";
import { CONFIG } from "../../config.js";

const bot = new Telegraf(CONFIG.telegramToken || "");

export default async function sendToTelegram(msg: string) {
    // TODO: implement core logic
    bot.telegram.sendMessage(0, msg);
}


