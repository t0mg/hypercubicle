export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
    message: string;
    level: LogLevel;
    timestamp: number;
    data?: any;
}

type LogListener = (entry: LogEntry) => void;

export class Logger {
    public entries: LogEntry[] = [];
    private listeners: LogListener[] = [];
    public muted: boolean = false;

    public on(listener: LogListener): void {
        this.listeners.push(listener);
    }

    public log(message: string, level: LogLevel = 'INFO', data?: any): void {
        const entry = { message, level, timestamp: Date.now(), data };
        if (!this.muted) {
            this.entries.push(entry);
            if (level !== 'DEBUG') {
                console.log(`[${level}] ${message}`);
            }
        }
        this.listeners.forEach(listener => listener(entry));
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

    public toJSON(): { entries: LogEntry[] } {
        return {
            entries: this.entries,
        };
    }

    public static fromJSON(data: { entries: LogEntry[] }): Logger {
        const logger = new Logger();
        logger.entries = data.entries || [];
        return logger;
    }
}
