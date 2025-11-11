import path from "path";
import fs from "fs";

export type LogLevel = 'debug' | 'info' | 'error';

const isoTime = () => new Date().toISOString();

export interface LoggerOptions {
  prefix?: string;
}

export class Logger {
    private prefix?: string;

    constructor(params: LoggerOptions) {
        this.prefix = params.prefix;
    }
    private format(level: LogLevel, msg: string) {
        const pre = this.prefix ? `[${this.prefix}] ` : '';
        return `${isoTime()} ${level.toUpperCase().padEnd(5)} ${pre}${msg}`;
    }

    log(level: LogLevel,msg:string, ...info: any[]) {
        const out = this.format(level ,msg);
        
        try {
            const filePath = path.resolve(process.cwd(), "yurei.log");
            fs.appendFileSync(filePath, out + (info.length ? ' ' + JSON.stringify(info) : '') + '\n');
        } catch(err) {
        }
    }

    debug(msg: string, ...info: any[]) { this.log('debug', msg, ...info); }
    info(msg: string, ...info: any[])  { this.log('info',  msg, ...info); }
    error(msg: string, ...info: any[]) { this.log('error', msg, ...info); }
}