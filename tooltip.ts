import './components/TooltipBox';
import { TooltipBox } from './components/TooltipBox';
import { t } from './text';

class TooltipManager {
  private static instance: TooltipManager;
  private tooltipBox: TooltipBox;
  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private desktopTooltipActive = false;
  private activeToolipKey: string;

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
    if (this.isTouchDevice()) return;

    const target = event.target as HTMLElement;
    const tooltipKey = this.findTooltipKey(target);

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (tooltipKey && this.activeToolipKey !== tooltipKey) {
      this.showTimeout = window.setTimeout(() => {
        target.addEventListener('mouseleave', this.handleMouseLeave.bind(this), { once: true });
        this.activeToolipKey = tooltipKey;
        const tooltipContent = this.getTooltipContent(tooltipKey);
        if (tooltipContent) {
          this.tooltipBox.show(tooltipContent, event.clientX, event.clientY);
          this.desktopTooltipActive = true;
        }
      }, 300); // 300ms delay before showing
    }
  }

  public handleMouseLeave() {
    if (this.isTouchDevice()) return;
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.tooltipBox.hide();
    this.activeToolipKey = '';
    this.desktopTooltipActive = false;
  }


  public handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('tooltip-icon')) {
      const tooltipKey = this.findTooltipKey(target.parentElement);
      if (tooltipKey) {
        const tooltipContent = this.getTooltipContent(tooltipKey);
        if (tooltipContent) {
          this.tooltipBox.show(tooltipContent, 0, 0); // Position is handled by CSS for touch
        }
      }
    }
  }

  private isTouchDevice(): boolean {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }

  private findTooltipKey(element: HTMLElement | null): string | null {
    if (!element) return null;
    return element.getAttribute('data-tooltip-key') || this.findTooltipKey(element.parentElement);
  }

  private getTooltipContent(key: string): { title: string, body: string } | null {
    const body = t(`tooltips.${key}.body`);
    if (body.includes('tooltips.')) {
      return null;
    }
    let title = t(`tooltips.${key}.title`);
    if (title.includes('tooltips.')) {
      title = t('global.information');
    }
    return {
      title: title,
      body: body
    };
  }
}

export const tooltipManager = TooltipManager.getInstance();