import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger, LogEntry } from '../../game/logger';

// Mock the t function
vi.mock('../../text', async (importOriginal) => {
    const original = await importOriginal();
    const en = (await import('../../public/locales/en.json')).default;
    return {
        ...(original as any),
        t: (key: string, data?: any) => {
            let message = en.log_messages[key.replace('log_messages.', '') as keyof typeof en.log_messages] || key;
            if (data) {
                for (const [k, v] of Object.entries(data)) {
                    message = message.replace(`{${k}}`, v as string);
                }
            }
            return message;
        },
    };
});

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getInstance();
    logger.loadEntries([]);
  });

  it('should create a log entry', () => {
    logger.info('info_new_adventurer', { fullName: 'Testy McTest', id: '1' });
    expect(logger.entries.length).toBe(1);
    const entry = logger.entries[0];
    expect(entry.level).toBe('INFO');
    expect(entry.message).toBe('Testy McTest (Exec. #1) enters the office!');
  });

  it('should handle all log levels', () => {
    logger.info('info_new_adventurer', { fullName: 'Testy McTest', id: '1' });
    logger.warn('warn_empty_hand', { name: 'Testy' });
    logger.error('info_game_over', { reason: 'test' });
    logger.debug('debug message');

    expect(logger.entries.length).toBe(4);
    expect(logger.entries[0].level).toBe('INFO');
    expect(logger.entries[1].level).toBe('WARN');
    expect(logger.entries[2].level).toBe('ERROR');
    expect(logger.entries[3].level).toBe('DEBUG');
  });

  it('should call listeners with the new entry', () => {
    const listener = vi.fn();
    logger.on(listener);
    logger.info('info_new_adventurer', { fullName: 'Testy McTest', id: '1' });
    expect(listener).toHaveBeenCalledOnce();
    const entry = listener.mock.calls[0][0] as LogEntry;
    expect(entry.message).toBe('Testy McTest (Exec. #1) enters the office!');
  });

  it('should serialize and deserialize correctly', () => {
    logger.info('info_new_adventurer', { fullName: 'Testy McTest', id: '1' });
    const json = logger.toJSON();
    const newLogger = Logger.fromJSON(json);
    expect(newLogger.entries.length).toBe(1);
    expect(newLogger.entries[0].message).toBe('Testy McTest (Exec. #1) enters the office!');
  });

  it('should log combat events', () => {
    logger.info('info_encounter_enemy', { name: 'Testy', current: 1, total: 1 });
    logger.info('info_enemy_defeated');
    expect(logger.entries.length).toBe(2);
    expect(logger.entries[0].message).toBe('Testy encounters hostile department member 1/1.');
    expect(logger.entries[1].message).toBe('A hostile department member has been synergized with.');
  });

  it('should log adventurer decisions', () => {
    logger.info('info_adventurer_decision', { name: 'Testy', decision: 'continue' });
    expect(logger.entries.length).toBe(1);
    expect(logger.entries[0].message).toBe('Testy decided to continue.');
  });
});