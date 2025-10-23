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
    overlay.dataset.testid = 'info-modal-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        const cancelButton = buttons.find((b) => typeof b.value === 'boolean' && b.value === false);
        if (cancelButton) {
          this.dismiss(cancelButton.value);
        }
      }
    });

    const windowEl = document.createElement('div');
    this.element = windowEl;
    windowEl.className = 'window';
    windowEl.style.width = 'min(90vw, 800px)';
    windowEl.setAttribute('role', 'dialog');
    windowEl.setAttribute('aria-modal', 'true');
    windowEl.setAttribute('aria-labelledby', 'info-modal-title');

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    const titleBarText = document.createElement('div');
    titleBarText.id = 'info-modal-title';
    titleBarText.className = 'title-bar-text';
    titleBarText.textContent = title;
    titleBar.appendChild(titleBarText);
    const cancelButton = buttons.find(
        (b) => typeof b.value === 'boolean' && b.value === false
    );
    if (cancelButton) {
      const titleBarControls = document.createElement('div');
      titleBarControls.className = 'title-bar-controls';
      const cancelButtonEl = document.createElement('button');
      cancelButtonEl.className = 'title-bar-button';
      cancelButtonEl.setAttribute('aria-label', 'Close');
      cancelButtonEl.addEventListener('click', () => {
        this.dismiss(cancelButton.value);
      });
      titleBarControls.appendChild(cancelButtonEl);
      titleBar.appendChild(titleBarControls);
    }
    windowEl.appendChild(titleBar);

    const windowBody = document.createElement('div');
    windowBody.className = 'window-body text-center p-4';

    const contentEl = document.createElement('div');
    contentEl.innerHTML = content;
    windowBody.appendChild(contentEl);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-end gap-2 mt-4';

    buttons.forEach((button) => {
      const buttonEl = document.createElement('button');
      buttonEl.textContent = button.text;
      buttonEl.addEventListener('click', () => {
        this.dismiss(button.value);
      });
      buttonContainer.appendChild(buttonEl);
    });

    windowBody.appendChild(buttonContainer);
    windowEl.appendChild(windowBody);

    overlay.appendChild(windowEl);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

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

    const focusableElements = windowEl.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    windowEl.addEventListener('keydown', (e) => {
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
    document.body.style.overflow = '';
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