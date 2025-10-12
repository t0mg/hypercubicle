import { t } from '../text';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  message: string;
  level: LogLevel;
  timestamp: number;
  data?: any;
}

type LogListener = (entry: LogEntry) => void;

export class Logger {
  private static instance: Logger;

  public entries: LogEntry[] = [];
  private listeners: LogListener[] = [];
  public muted: boolean = false;

  private constructor() {
    // private constructor
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public on(listener: LogListener): void {
    this.listeners.push(listener);
  }

  public log(key: string, level: LogLevel = 'INFO', data?: any): void {
    const message = t(`log_messages.${key}`, data);
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
    // Debug messages are not localized
    const entry: LogEntry = { message, level: 'DEBUG', timestamp: Date.now() };
    if (!this.muted) {
      this.entries.push(entry);
    }
    this.listeners.forEach(listener => listener(entry));
  }

  public info(key: string, data?: any): void {
    this.log(key, 'INFO', data);
  }

  public warn(key: string, data?: any): void {
    this.log(key, 'WARN', data);
  }

  public error(key: string, data?: any): void {
    this.log(key, 'ERROR', data);
  }

  public toJSON(): { entries: LogEntry[] } {
    return {
      entries: this.entries,
    };
  }

  public loadEntries(entries: LogEntry[]): void {
    this.entries = entries || [];
  }

  public static fromJSON(data: { entries: LogEntry[] }): Logger {
    const logger = Logger.getInstance();
    logger.loadEntries(data.entries);
    return logger;
  }
}