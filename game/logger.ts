export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
    message: string;
    level: LogLevel;
    timestamp: number;
}

export class Logger {
    public entries: LogEntry[] = [];

    public log(message: string, level: LogLevel = 'INFO'): void {
        this.entries.push({ message, level, timestamp: Date.now() });
        console.log(`[${level}] ${message}`);
    }

    public debug(message: string): void {
        this.log(message, 'DEBUG');
    }

    public info(message: string): void {
        this.log(message, 'INFO');
    }

    public warn(message: string): void {
        this.log(message, 'WARN');
    }

    public error(message: string): void {
        this.log(message, 'ERROR');
    }
}
