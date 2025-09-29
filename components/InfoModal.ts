import { t } from '../text';

export class InfoModal extends HTMLElement {
  private _isOpen = false;

  constructor() {
    super();
    this.addEventListener('click', (e) => {
      const target = e.composedPath()[0] as HTMLElement;
      if (target.id === 'modal-close-button' || target.id === 'modal-overlay') {
        this.hide();
      }
    });
  }

  public show(title: string, content: string, buttonText?: string) {
    this._isOpen = true;
    this.render(title, content, buttonText);
  }

  public hide() {
    if (!this._isOpen) return;
    this._isOpen = false;
    this.innerHTML = '';
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }));
  }

  private render(title: string, content: string, buttonText: string = t('global.continue')) {
    if (!this._isOpen) {
      this.innerHTML = '';
      return;
    }

    this.innerHTML = `
      <div id="modal-overlay" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
        <div class="bg-brand-surface p-8 pixel-corners shadow-2xl text-center border-2 border-brand-primary animate-fade-in-up w-full max-w-2xl">
          <h2 class="text-4xl font-title text-brand-secondary mb-4">${title}</h2>
          <div class="text-brand-text mb-6 max-h-[60vh] overflow-y-auto text-left">
            ${content}
          </div>
          <button id="modal-close-button" class="bg-brand-primary text-white py-3 px-8 pixel-corners hover:scale-105 transition-transform transform">
            ${buttonText}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('info-modal', InfoModal);