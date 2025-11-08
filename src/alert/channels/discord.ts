import type { AlertChannel } from "./channels.js";

export class Discord implements AlertChannel {
    async sendAlert(message: string): Promise<void> {
        
    }

    getName(): string {
        return "Discord";
    }
}

export function create(): AlertChannel {
    return new Discord();
}