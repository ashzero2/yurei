import { Discord } from "./discord.js";
import Telegram from "./telegram.js";

export interface AlertChannel {
    sendAlert(message: string): Promise<void>;
    getName(): string;
}

export function getLoadedChannels(): Map<string, AlertChannel> {
    const channels: Map<string, AlertChannel> = new Map();
    channels.set("Telegram", new Telegram());
    channels.set("Discord", new Discord());
    return channels;
}

export async function sendAlerts(message: string, channels: Map<string, AlertChannel>) {
    await Promise.allSettled([
        Array.from(channels.values()).map(channel => {
            channel.sendAlert(message).catch(err => {
                console.error(`Error sending alert via ${channel.getName()}:`, err);
            })
        })
    ]);
}