import { t } from '../text';

export class InfoModal {
  private element: HTMLDivElement;
  private resolve: () => void;
  private handleKeydown: (event: KeyboardEvent) => void;

  private constructor(title: string, content: string, buttonText: string, resolve: () => void) {
    this.resolve = resolve;

    const overlay = document.createElement("div");
    overlay.className = "info-modal-overlay";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.dismiss();
      }
    });

    const modal = document.createElement("div");
    this.element = modal;
    modal.className = "info-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "info-modal-title");

    const titleEl = document.createElement("h2");
    titleEl.id = "info-modal-title";
    titleEl.textContent = title;
    modal.appendChild(titleEl);

    const contentEl = document.createElement("p");
    contentEl.innerHTML = content;
    modal.appendChild(contentEl);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = "info-modal-buttons";

    const actionButton = document.createElement("button");
    actionButton.textContent = buttonText;
    actionButton.addEventListener("click", () => {
      this.dismiss();
    });
    buttonContainer.appendChild(actionButton);

    modal.appendChild(buttonContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.dismiss();
      }
    };
    document.addEventListener("keydown", this.handleKeydown);

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
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

  private dismiss() {
    this.element.parentElement!.remove();
    document.removeEventListener("keydown", this.handleKeydown);
    this.resolve();
  }

  public static show(title: string, content: string, buttonText: string = t('global.continue')): Promise<void> {
    return new Promise((resolve) => {
      new InfoModal(title, content, buttonText, resolve);
    });
  }
}