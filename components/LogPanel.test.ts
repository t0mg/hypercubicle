import { describe, it, expect, vi } from 'vitest';
import { LogPanel } from './LogPanel';
import { Logger } from '../game/logger';
import { AdventurerTraits }from '../types';

describe('LogPanel', () => {
    it('should render initial logs and append new ones', async () => {
        const logger = new Logger();
        const logPanel = new LogPanel();
        document.body.appendChild(logPanel);

        const traits: AdventurerTraits = {
            skill: 5,
            stamina: 10,
            luck: 1
        };

        logPanel.traits = traits;
        logPanel.logger = logger;

        logger.info('test_log_1');
        logger.info('test_log_2');

        await new Promise(resolve => setTimeout(resolve, 100));

        const logContainer = logPanel.querySelector('#log-container');
        expect(logContainer).not.toBeNull();
        expect(logContainer?.children.length).toBe(2);
        expect(logContainer?.children[0].textContent).toContain('[000]');
        expect(logContainer?.children[1].textContent).toContain('[001]');

        logger.info('test_log_3');

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(logContainer?.children.length).toBe(3);
        expect(logContainer?.children[2].textContent).toContain('[002]');
    });
});