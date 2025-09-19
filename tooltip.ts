import './components/TooltipBox';
import { TooltipBox } from './components/TooltipBox';
import { t } from './text';

class TooltipManager {
    private static instance: TooltipManager;
    private tooltipBox: TooltipBox;
    private showTimeout: number | null = null;
    private hideTimeout: number | null = null;

    private constructor() {
        // The TooltipBox component is expected to be registered via import
        this.tooltipBox = document.createElement('tooltip-box') as TooltipBox;
        document.body.appendChild(this.tooltipBox);
    }

    public static getInstance(): TooltipManager {
        if (!TooltipManager.instance) {
            TooltipManager.instance = new TooltipManager();
        }
        return TooltipManager.instance;
    }

    public handleMouseEnter(event: MouseEvent) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        const target = event.target as HTMLElement;
        const tooltipKey = this.findTooltipKey(target);

        if (tooltipKey) {
            this.showTimeout = window.setTimeout(() => {
                const tooltipContent = this.getTooltipContent(tooltipKey);
                if (tooltipContent) {
                    this.tooltipBox.show(tooltipContent, event.clientX, event.clientY);
                }
            }, 300); // 300ms delay before showing
        }
    }

    public handleMouseLeave() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        this.hideTimeout = window.setTimeout(() => {
            this.tooltipBox.hide();
        }, 100); // 100ms delay before hiding
    }

    private findTooltipKey(element: HTMLElement | null): string | null {
        if (!element) return null;
        return element.getAttribute('data-tooltip-key') || this.findTooltipKey(element.parentElement);
    }

    private getTooltipContent(key: string): { title: string, body: string } | null {
        // For now, we'll use a placeholder.
        // In a later step, we will get this from the localization file.
        const body = t(`tooltips.${key}.body`);
        if (body.includes('tooltips.')) {
            // Key not found
            return null;
        }

        // Check if a title exists for this key
        let title = t(`tooltips.${key}.title`);
        if (title.includes('tooltips.')) {
            title = t('global.information'); // Default title
        }

        return {
            title: title,
            body: body
        };
    }
}

export const tooltipManager = TooltipManager.getInstance();
