import './components/TooltipBox';
import { TooltipBox } from './components/TooltipBox';
import { t } from './text';

class TooltipManager {
  private static instance: TooltipManager;
  private tooltipBox: TooltipBox;
  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private activeToolipKey: string;
  private mutationObserver: MutationObserver;

  private constructor() {
    // The TooltipBox component is expected to be registered via import
    this.tooltipBox = document.createElement('tooltip-box') as TooltipBox;
    document.body.appendChild(this.tooltipBox);
    this.mutationObserver = new MutationObserver(() => {
      this.tooltipBox.hide();
      this.activeToolipKey = '';
    });
  }

  public static getInstance(): TooltipManager {
    if (!TooltipManager.instance) {
      TooltipManager.instance = new TooltipManager();
    }
    return TooltipManager.instance;
  }

  public initializeTooltipIcons() {
    const tooltipElements = document.querySelectorAll('[data-tooltip-key]');
    tooltipElements.forEach(el => {
      const icon = document.createElement('span');
      icon.textContent = '?';
      icon.className = 'tooltip-icon';
      el.appendChild(icon);
    });
  }

  public handleMouseEnter(event: MouseEvent) {
    if (this.isTouchDevice()) return;

    const tooltipKeyElement = this.findTooltipKeyElement(event.target as HTMLElement);
    const tooltipKey = tooltipKeyElement && tooltipKeyElement.getAttribute('data-tooltip-key');

    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (tooltipKey && this.activeToolipKey !== tooltipKey) {
      this.showTimeout = window.setTimeout(() => {
        tooltipKeyElement.addEventListener('mouseleave', this.handleMouseLeave.bind(this), { once: true });
        this.activeToolipKey = tooltipKey;
        const tooltipContent = this.getTooltipContent(tooltipKey);
        if (tooltipContent) {
          this.mutationObserver.observe(document, { childList: true, subtree: true });
          this.tooltipBox.show(tooltipContent, tooltipKeyElement);
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
    this.mutationObserver.disconnect();
    this.tooltipBox.hide();
    this.activeToolipKey = '';
  }

  public handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('tooltip-icon')) {
      const tooltipKeyElement = this.findTooltipKeyElement(target.parentElement);
      const tooltipKey = tooltipKeyElement.getAttribute('data-tooltip-key');
      if (tooltipKey) {
        const tooltipContent = this.getTooltipContent(tooltipKey);
        if (tooltipContent) {
          this.tooltipBox.show(tooltipContent, tooltipKeyElement); // Position is handled by CSS for touch
        }
      }
    }
  }

  private isTouchDevice(): boolean {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }

  private findTooltipKeyElement(element: HTMLElement | null): HTMLElement | null {
    if (!element) return null;
    if (element.hasAttribute('data-tooltip-key')) return element;
    return this.findTooltipKeyElement(element.parentElement);
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