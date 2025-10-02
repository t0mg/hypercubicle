import { t } from '../text';

export type ModalButton<T> = {
  text: string;
  value: T;
  variant?: 'primary' | 'secondary';
};

export class InfoModal<T> {
  private element: HTMLDivElement;
  private resolve: (value: T) => void;
  private handleKeydown: (event: KeyboardEvent) => void;

  private constructor(
    title: string,
    content: string,
    buttons: ModalButton<T>[],
    resolve: (value: T) => void
  ) {
    this.resolve = resolve;

    const overlay = document.createElement('div');
    overlay.className = 'info-modal-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        // Find a 'cancel' or 'close' button if it exists
        const cancelButton = buttons.find(
          (b) =>
            typeof b.value === 'boolean' && b.value === false
        );
        if (cancelButton) {
          this.dismiss(cancelButton.value);
        }
      }
    });

    const modal = document.createElement('div');
    this.element = modal;
    modal.className =
      'info-modal p-4 flex flex-col justify-between shadow-lg gap-4 animate-fade-in';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'info-modal-title');

    const titleEl = document.createElement('h2');
    titleEl.id = 'info-modal-title';
    titleEl.textContent = title;
    modal.appendChild(titleEl);

    const contentEl = document.createElement('p');
    contentEl.innerHTML = content;
    modal.appendChild(contentEl);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'info-modal-buttons';

    buttons.forEach((button, index) => {
      const buttonEl = document.createElement('button');
      const isPrimary = button.variant === 'primary' || (button.variant !== 'secondary' && index === 0);
      buttonEl.className = `${
        isPrimary
          ? 'bg-brand-primary text-white'
          : 'bg-gray-600 text-white'
      } py-3 px-8 pixel-corners transition-all transform hover:scale-105`;
      buttonEl.textContent = button.text;
      buttonEl.addEventListener('click', () => {
        this.dismiss(button.value);
      });
      buttonContainer.appendChild(buttonEl);
    });

    modal.appendChild(buttonContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const cancelButton = buttons.find(
          (b) =>
            typeof b.value === 'boolean' && b.value === false
        );
        if (cancelButton) {
          this.dismiss(cancelButton.value);
        }
      }
    };
    document.addEventListener('keydown', this.handleKeydown);

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  private dismiss(value: T) {
    this.element.parentElement!.remove();
    document.removeEventListener('keydown', this.handleKeydown);
    this.resolve(value);
  }

  public static show<T>(
    title: string,
    content: string,
    buttons: ModalButton<T>[]
  ): Promise<T> {
    return new Promise((resolve) => {
      new InfoModal<T>(title, content, buttons, resolve);
    });
  }

  public static showInfo(
    title: string,
    content: string,
    buttonText: string = t('global.continue')
  ): Promise<void> {
    const buttons: ModalButton<void>[] = [{ text: buttonText, value: undefined }];
    return InfoModal.show(title, content, buttons);
  }
}