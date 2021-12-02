class Tooltip {
  static tooltip = null;

  constructor() {
    if (Tooltip.tooltip) {
      return Tooltip.tooltip;
    }
    Tooltip.tooltip = this;
  }

  render(text = '') {
    const el = document.createElement('div');
    el.innerHTML = this.getTemplate(text);
    this.element = el.firstElementChild;
    document.body.append(this.element);
  }

  initialize() {
    this.addHandler();
  }

  remove() {
    this.element.remove();
    Tooltip.tooltip = null;
  }

  destroy() {
    document.body.removeEventListener('pointerover', this.pointerOverHandler);
    document.body.removeEventListener('pointermove', this.pointerMoveHandler);
    document.body.removeEventListener('pointerout', this.pointerOutHandler);
    this.remove();
  }

  addHandler() {
    document.body.addEventListener('pointerover', this.pointerOverHandler);
  }

  pointerOverHandler = (event) => {
    const element = event.target.closest('[data-tooltip]');
    if (!element) {
      return;
    }

    this.render();
    this.updatePosition(event.clientX, event.clientY);

    this.element.innerHTML = event.target.dataset.tooltip;

    document.body.addEventListener('pointermove', this.pointerMoveHandler);
    document.body.addEventListener('pointerout', this.pointerOutHandler);
  }

  pointerOutHandler = () => {
    document.body.removeEventListener('pointermove', this.pointerMoveHandler);
    document.body.removeEventListener('pointerout', this.pointerOutHandler);
    console.log(this);
    this.remove();
  }

  pointerMoveHandler = (event) => {
    this.updatePosition(event.clientX, event.clientY);
  }

  updatePosition(clientX, clientY) {
    const shift = 4;
    this.element.style.left = clientX + shift + 'px';
    this.element.style.top = clientY + shift + 'px';
  }

  getElementsWithTip() {
    const result = [];
    document.querySelectorAll('[data-tooltip]').forEach((item) => {
      result.push({
        element: item,
        text: item.dataset.tooltip
      });
    });
    return result;
  }

  getTemplate(text = '') {
    return `<div class="tooltip">${text}</div>`;
  }
}

export default Tooltip;
