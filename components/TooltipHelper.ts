export function initializeTooltipIcons() {
  const tooltipElements = document.querySelectorAll('[data-tooltip-key]');
  tooltipElements.forEach(el => {
    const icon = document.createElement('span');
    icon.textContent = '?';
    icon.className = 'tooltip-icon';
    el.appendChild(icon);
  });
}